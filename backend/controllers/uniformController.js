import UniformItem from '../models/UniformItem.js';
import StudentUniform from '../models/StudentUniform.js';
import UniformInventory from '../models/UniformInventory.js';
import Student from '../models/Student.js';
import Class from '../models/Class.js';

//UNIFORM ITEMS MANAGEMENT 

export const getAllUniformItems = async (req, res) => {
    try {
        const uniformItems = await UniformItem.find({ isActive: true }).sort({ name: 1 });

        const itemsWithAvailable = uniformItems.map(item => ({
            ...item.toObject(),
            available: item.totalStock - item.issued - item.damaged
        }));

        res.status(200).json({
            success: true,
            message: 'Uniform items retrieved successfully',
            data: itemsWithAvailable,
            total: itemsWithAvailable.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching uniform items',
            error: error.message
        });
    }
};

export const createUniformItem = async (req, res) => {
    try {
        let { name, sizes, totalStock, description, reorderLevel } = req.body;

        // ✅ VALIDATE AND PARSE SIZES
        if (typeof sizes === 'string') {
            try {
                sizes = JSON.parse(sizes);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sizes format. Must be an array of objects with size and stock properties'
                });
            }
        }

        // Validate sizes is an array
        if (!Array.isArray(sizes)) {
            return res.status(400).json({
                success: false,
                message: 'Sizes must be an array'
            });
        }

        // Validate each size object
        for (let sizeObj of sizes) {
            if (!sizeObj.size || sizeObj.stock === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Each size must have "size" and "stock" properties'
                });
            }
            if (typeof sizeObj.stock !== 'number' || sizeObj.stock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock must be a positive number'
                });
            }
        }

        // Validate name
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        // Check if uniform item already exists
        const existingItem = await UniformItem.findOne({ name });
        if (existingItem) {
            return res.status(400).json({
                success: false,
                message: 'Uniform item already exists'
            });
        }

        // Calculate total stock
        const calculatedTotalStock = sizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);

        const uniformItem = new UniformItem({
            name,
            sizes: sizes.map(s => ({
                size: String(s.size),
                stock: Number(s.stock)
            })),
            totalStock: calculatedTotalStock,
            issued: 0,
            damaged: 0,
            description: description || '',
            reorderLevel: Number(reorderLevel) || 20
        });

        await uniformItem.save();

        res.status(201).json({
            success: true,
            message: 'Uniform item created successfully',
            data: uniformItem
        });
    } catch (error) {
        console.error('Error creating uniform item:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating uniform item',
            error: error.message
        });
    }
};

export const updateUniformItem = async (req, res) => {
    try {
        const { id } = req.params;
        let { name, sizes, totalStock, description, reorderLevel } = req.body;

        // ✅ VALIDATE AND PARSE SIZES
        if (typeof sizes === 'string') {
            try {
                sizes = JSON.parse(sizes);
            } catch (e) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sizes format. Must be an array of objects'
                });
            }
        }

        if (!Array.isArray(sizes)) {
            return res.status(400).json({
                success: false,
                message: 'Sizes must be an array'
            });
        }

        // Get existing item first
        const existingItem = await UniformItem.findById(id);
        if (!existingItem) {
            return res.status(404).json({
                success: false,
                message: 'Uniform item not found'
            });
        }

        // Calculate total stock from sizes
        const calculatedTotalStock = sizes.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);

        const uniformItem = await UniformItem.findByIdAndUpdate(
            id,
            {
                name,
                sizes: sizes.map(s => ({
                    size: String(s.size),
                    stock: Number(s.stock)
                })),
                totalStock: calculatedTotalStock,
                description: description || '',
                reorderLevel: Number(reorderLevel) || 20
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Uniform item updated successfully',
            data: uniformItem
        });
    } catch (error) {
        console.error('Error updating uniform item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating uniform item',
            error: error.message
        });
    }
};

export const deleteUniformItem = async (req, res) => {
    try {
        const { id } = req.params;

        await UniformItem.findByIdAndUpdate(id, { isActive: false });

        res.status(200).json({
            success: true,
            message: 'Uniform item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting uniform item',
            error: error.message
        });
    }
};

// ============ STUDENT UNIFORM MANAGEMENT ============

export const getStudentUniformsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        const studentUniforms = await StudentUniform.find({ class: classId })
            .populate('student', 'firstName lastName studentId')
            .populate('class', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Student uniforms retrieved successfully',
            data: studentUniforms,
            total: studentUniforms.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student uniforms',
            error: error.message
        });
    }
};

export const getStudentUniformDetails = async (req, res) => {
    try {
        const { studentId } = req.params;

        const studentUniform = await StudentUniform.findOne({ student: studentId })
            .populate('student', 'firstName lastName studentId')
            .populate('class', 'name');

        if (!studentUniform) {
            return res.status(404).json({
                success: false,
                message: 'Student uniform record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student uniform details retrieved successfully',
            data: studentUniform
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching student uniform details',
            error: error.message
        });
    }
};

export const issueUniformToStudent = async (req, res) => {
    try {
        const { studentId, classId, uniforms } = req.body;
        console.log('Issue Uniform Request Body:', req.body);
        // Validate student and class
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        // Check if student already has uniform record
        let studentUniform = await StudentUniform.findOne({ student: studentId });
        console.log('Existing Student Uniform Record:', studentUniform);
        if (!studentUniform) {
            studentUniform = new StudentUniform({
                student: studentId,
                class: classId,
                uniforms: [],
                totalUniformsIssued: 0
            });
        }

        // Issue uniforms and update inventory
        for (const uniform of uniforms) {
            const uniformItem = await UniformItem.findOne({ name: uniform.itemName });

            if (!uniformItem) {
                return res.status(404).json({
                    success: false,
                    message: `Uniform item '${uniform.itemName}' not found`
                });
            }

            // Check if size exists in uniform item
            const sizeIndex = uniformItem.sizes.findIndex(s => s.size === uniform.size);
            if (sizeIndex === -1 || uniformItem.sizes[sizeIndex].stock < uniform.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${uniform.itemName} size ${uniform.size}`
                });
            }

            // Deduct from inventory
            uniformItem.sizes[sizeIndex].stock -= uniform.quantity;
            uniformItem.issued += uniform.quantity;
            uniformItem.save();

            console.log("UniformItem : ", uniformItem);

            // Add to student uniform record
            const existingUniform = studentUniform.uniforms.findIndex(
                u => u.itemName === uniform.itemName && u.size === uniform.size
            );

            if (existingUniform !== -1) {
                studentUniform.uniforms[existingUniform] = {
                    ...uniform,
                    issueDate: new Date()
                };
            } else {
                studentUniform.uniforms.push({
                    ...uniform,
                    issueDate: new Date()
                });
            }

            console.log("Enter    ....");
            // Record inventory transaction
            await UniformInventory.create({
                uniformItem: uniformItem._id,
                transactionType: 'issue',
                size: uniform.size,
                quantity: uniform.quantity,
                student: studentId,
                previousStock: uniformItem.sizes[sizeIndex].stock + uniform.quantity,
                newStock: uniformItem.sizes[sizeIndex].stock,
                recordedBy: req.user?._id || null,
            });
            console.log("Exit    ....");
        }

        studentUniform.status = 'issued';
        studentUniform.totalUniformsIssued = studentUniform.uniforms.length;
        await studentUniform.save();

        console.log('Updated Student Uniform Record:', studentUniform);

        const populatedRecord = await StudentUniform.findById(studentUniform._id)
            .populate('student', 'firstName lastName studentId')
            .populate('class', 'name');

        res.status(200).json({
            success: true,
            message: 'Uniforms issued successfully',
            data: populatedRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error issuing uniforms',
            error: error.message
        });
    }
};

export const updateUniformCondition = async (req, res) => {
    try {
        const { studentId, itemName, condition } = req.body;

        const studentUniform = await StudentUniform.findOne({ student: studentId });

        if (!studentUniform) {
            return res.status(404).json({
                success: false,
                message: 'Student uniform record not found'
            });
        }

        // Find and update the uniform condition
        const uniformIndex = studentUniform.uniforms.findIndex(
            u => u.itemName === itemName
        );

        if (uniformIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Uniform not found in student record'
            });
        }

        const previousCondition = studentUniform.uniforms[uniformIndex].condition;
        studentUniform.uniforms[uniformIndex].condition = condition;

        // If condition changed to damaged, update inventory
        if (previousCondition !== 'damaged' && condition === 'damaged') {
            const uniformItem = await UniformItem.findOne({ name: itemName });
            uniformItem.damaged += 1;
            uniformItem.issued -= 1;
            await uniformItem.save();

            await UniformInventory.create({
                uniformItem: uniformItem._id,
                transactionType: 'damage',
                size: studentUniform.uniforms[uniformIndex].size,
                quantity: 1,
                student: studentId,
                reason: 'Uniform condition changed to damaged',
                previousStock: uniformItem.damaged - 1,
                newStock: uniformItem.damaged,
                recordedBy: req.user._id,
            });
        }

        await studentUniform.save();

        const populatedRecord = await StudentUniform.findById(studentUniform._id)
            .populate('student', 'firstName lastName studentId')
            .populate('class', 'name');

        res.status(200).json({
            success: true,
            message: 'Uniform condition updated successfully',
            data: populatedRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating uniform condition',
            error: error.message
        });
    }
};

// ============ CLASS UNIFORM STATISTICS ============

export const getClassUniformStats = async (req, res) => {
    try {
        const { classId } = req.params;

        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        const studentUniforms = await StudentUniform.find({ class: classId });
        console.log('Student Uniforms:', studentUniforms);
        const totalStudents = await Student.countDocuments({ class: classId, isDeleted: false });
        const uniformsIssued = studentUniforms.filter(u => u.status === 'issued').length;
        const uniformsPending = studentUniforms.filter(u => u.status === 'pending').length;

        const issuedPercentage = totalStudents > 0
            ? ((uniformsIssued / totalStudents) * 100).toFixed(1)
            : 0;

        res.status(200).json({
            success: true,
            message: 'Class uniform statistics retrieved successfully',
            data: {
                className: classData.name,
                totalStudents,
                uniformsIssued,
                uniformsPending,
                issuedPercentage,
                pendingPercentage: (100 - issuedPercentage).toFixed(1)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching class uniform statistics',
            error: error.message
        });
    }
};



export const getAllClassesUniformSummary = async (req, res) => {
    try {
        const classes = await Class.find({ status: { $ne: "DELETED" } });

        const settled = await Promise.allSettled(
            classes.map(async (classItem) => {
                const classId = classItem._id;

                const totalStudents = await Student.countDocuments({
                    class: classId,
                    isDeleted: false,
                });

                const uniformsIssued = await StudentUniform.countDocuments({
                    class: classId,
                    status: 'issued',
                });

                const uniformsPartial = await StudentUniform.countDocuments({
                    class: classId,
                    status: 'partial',
                });

                const uniformsPending = Math.max(totalStudents - uniformsIssued, 0);
                const issuedPercentage =
                    totalStudents > 0 ? ((uniformsIssued / totalStudents) * 100).toFixed(1) : '0.0';

                return {
                    _id: classId,
                    name: classItem.name,
                    students: totalStudents,
                    uniformsIssued,
                    uniformsPending,
                    uniformsPartial,
                    issuedPercentage,
                };
            })
        );

        const summary = settled.map((r, idx) =>
            r.status === 'fulfilled'
                ? r.value
                : {
                    _id: classes[idx]?._id,
                    name: classes[idx]?.name,
                    students: 0,
                    uniformsIssued: 0,
                    uniformsPending: 0,
                    uniformsPartial: 0,
                    issuedPercentage: '0.0',
                    error: r.reason?.message || String(r.reason),
                }
        );

        return res.status(200).json({
            success: true,
            message: 'All classes uniform summary retrieved successfully',
            data: summary,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching classes uniform summary',
            error: error.message,
        });
    }
};

// ============ INVENTORY MANAGEMENT ============

export const getInventoryHistory = async (req, res) => {
    try {
        const { uniformItemId, limit = 50, skip = 0 } = req.query;

        let query = {};
        if (uniformItemId) {
            query.uniformItem = uniformItemId;
        }

        const history = await UniformInventory.find(query)
            .populate('uniformItem', 'name')
            .populate('student', 'firstName lastName studentId')
            .populate('recordedBy', 'firstName lastName')
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await UniformInventory.countDocuments(query);

        res.status(200).json({
            success: true,
            message: 'Inventory history retrieved successfully',
            data: history,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching inventory history',
            error: error.message
        });
    }
};

export const addInventory = async (req, res) => {
    try {
        const { uniformItemId, size, quantity, reason } = req.body;

        const uniformItem = await UniformItem.findById(uniformItemId);
        if (!uniformItem) {
            return res.status(404).json({
                success: false,
                message: 'Uniform item not found'
            });
        }

        // Find or create size entry
        const sizeIndex = uniformItem.sizes.findIndex(s => s.size === size);

        if (sizeIndex === -1) {
            uniformItem.sizes.push({ size, stock: quantity });
        } else {
            uniformItem.sizes[sizeIndex].stock += quantity;
        }

        uniformItem.totalStock += quantity;
        const previousStock = uniformItem.totalStock - quantity;

        await uniformItem.save();

        // Record transaction
        await UniformInventory.create({
            uniformItem: uniformItemId,
            transactionType: 'purchase',
            size,
            quantity,
            reason: reason || 'Stock addition',
            previousStock,
            newStock: uniformItem.totalStock,
            recordedBy: req.user._id,
        });

        res.status(200).json({
            success: true,
            message: 'Inventory added successfully',
            data: uniformItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding inventory',
            error: error.message
        });
    }
};

export const getLowStockItems = async (req, res) => {
    try {
        const items = await UniformItem.find({ isActive: true });

        const lowStockItems = items.filter(item => {
            const available = item.totalStock - item.issued - item.damaged;
            return available < item.reorderLevel;
        });

        res.status(200).json({
            success: true,
            message: 'Low stock items retrieved successfully',
            data: lowStockItems,
            total: lowStockItems.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching low stock items',
            error: error.message
        });
    }
};

// ============ REPORTS ============

export const getUniformReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateQuery = {};
        if (startDate && endDate) {
            dateQuery = {
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        const totalTransactions = await UniformInventory.countDocuments(dateQuery);
        const issuedCount = await UniformInventory.countDocuments({
            ...dateQuery,
            transactionType: 'issue'
        });
        const damagedCount = await UniformInventory.countDocuments({
            ...dateQuery,
            transactionType: 'damage'
        });
        const purchaseCount = await UniformInventory.countDocuments({
            ...dateQuery,
            transactionType: 'purchase'
        });

        const uniformItems = await UniformItem.find({ isActive: true });
        const totalIssued = uniformItems.reduce((sum, item) => sum + item.issued, 0);
        const totalDamaged = uniformItems.reduce((sum, item) => sum + item.damaged, 0);
        const totalStocked = uniformItems.reduce((sum, item) => sum + item.totalStock, 0);

        res.status(200).json({
            success: true,
            message: 'Uniform report retrieved successfully',
            data: {
                summary: {
                    totalTransactions,
                    issuedCount,
                    damagedCount,
                    purchaseCount
                },
                inventory: {
                    totalStocked,
                    totalIssued,
                    totalDamaged,
                    available: totalStocked - totalIssued - totalDamaged
                },
                uniformItems: uniformItems.map(item => ({
                    name: item.name,
                    totalStock: item.totalStock,
                    issued: item.issued,
                    damaged: item.damaged,
                    available: item.totalStock - item.issued - item.damaged
                }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating uniform report',
            error: error.message
        });
    }
};

