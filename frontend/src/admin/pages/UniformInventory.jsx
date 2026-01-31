// frontend/src/admin/pages/UniformInventory.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Loader, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/authContext/AuthContext';

const UniformInventory = () => {
    const { token, axios } = useAuth();

    // State management
    const [uniformItems, setUniformItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedItems, setExpandedItems] = useState(new Set());

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        sizes: [{ size: '', stock: 0 }],
        totalStock: 0,
        description: '',
        reorderLevel: 20
    });

    const uniformNames = ['Shirt', 'Pants', 'Shoes', 'Belt', 'Tie', 'Socks (pair)'];
    const commonSizes = {
        'Shirt': ['S', 'M', 'L', 'XL'],
        'Pants': ['28', '30', '32', '34', '36'],
        'Shoes': ['5', '6', '7', '8', '9', '10', '11'],
        'Belt': ['S', 'M', 'L', 'XL'],
        'Tie': ['One Size'],
        'Socks (pair)': ['One Size']
    };

    // ============ API CALLS ============

    const getAllUniformItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/uniforms/items', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUniformItems(response.data.data || []);
        } catch (error) {
            console.error('Error fetching uniform items:', error);
            alert('Failed to load uniform items');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUniformItem = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name) {
            alert('Please select a uniform item name');
            return;
        }

        const validSizes = formData.sizes.filter(s => s.size && s.stock > 0);
        if (validSizes.length === 0) {
            alert('Please add at least one size with stock');
            return;
        }

        const totalStockCalculated = validSizes.reduce((sum, s) => sum + s.stock, 0);

        try {
            setLoading(true);

            // ✅ PROPERLY FORMAT THE PAYLOAD
            const payload = {
                name: formData.name,
                sizes: validSizes.map(s => ({
                    size: String(s.size),
                    stock: Number(s.stock)
                })),
                totalStock: Number(totalStockCalculated),
                description: String(formData.description || ''),
                reorderLevel: Number(formData.reorderLevel || 20)
            };

            console.log('Sending payload:', JSON.stringify(payload, null, 2));

            if (editingId) {
                // Update existing item
                const response = await axios.put(
                    `/admin/uniforms/items/${editingId}`,
                    payload,
                    {
                        headers: {token}
                    }
                );
                alert('Uniform item updated successfully');
            } else {
                // Create new item
                const response = await axios.post(
                    '/admin/uniforms/items',
                    payload,
                    {
                        headers: {token}
                    }
                );
                console.log('Create response:', response);
                alert('Uniform item created successfully');
            }

            // Reset form and refresh data
            setFormData({
                name: '',
                sizes: [{ size: '', stock: 0 }],
                totalStock: 0,
                description: '',
                reorderLevel: 20
            });
            setShowForm(false);
            setEditingId(null);
            getAllUniformItems();
        } catch (error) {
            console.error('Error saving uniform item:', error);
            alert(error.response?.data?.message || 'Failed to save uniform item');
        } finally {
            setLoading(false);
        }
    };

    const handleEditItem = (item) => {
        setFormData({
            name: item.name,
            sizes: item.sizes || [{ size: '', stock: 0 }],
            totalStock: item.totalStock,
            description: item.description || '',
            reorderLevel: item.reorderLevel || 20
        });
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm('Are you sure you want to delete this uniform item?')) {
            try {
                setLoading(true);
                await axios.delete(`/admin/uniforms/items/${id}`, {
                    headers: {token}
                });
                alert('Uniform item deleted successfully');
                getAllUniformItems();
            } catch (error) {
                console.error('Error deleting uniform item:', error);
                alert(error.response?.data?.message || 'Failed to delete uniform item');
            } finally {
                setLoading(false);
            }
        }
    };

    // ============ LIFECYCLE ============

    useEffect(() => {
        getAllUniformItems();
    }, [token]);

    // ============ HELPER FUNCTIONS ============

    const toggleExpanded = (id) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
        setFormData({ ...formData, sizes: newSizes });
    };

    const addSizeField = () => {
        setFormData({
            ...formData,
            sizes: [...formData.sizes, { size: '', stock: 0 }]
        });
    };

    const removeSizeField = (index) => {
        const newSizes = formData.sizes.filter((_, i) => i !== index);
        setFormData({ ...formData, sizes: newSizes.length > 0 ? newSizes : [{ size: '', stock: 0 }] });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            sizes: [{ size: '', stock: 0 }],
            totalStock: 0,
            description: '',
            reorderLevel: 20
        });
        setShowForm(false);
        setEditingId(null);
    };

    // Filter items based on search
    const filteredItems = uniformItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ============ RENDER ============

    if (loading && uniformItems.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Uniform Inventory Management</h1>
                <p className="text-gray-600">Add and manage school uniform items and stock</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900">{uniformItems.length}</p>
                    <p className="text-gray-500 text-xs mt-2">Uniform types</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Total Stock</p>
                    <p className="text-3xl font-bold text-green-600">
                        {uniformItems.reduce((sum, item) => sum + (item.totalStock || 0), 0)}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">Units in inventory</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Issued</p>
                    <p className="text-3xl font-bold text-yellow-600">
                        {uniformItems.reduce((sum, item) => sum + (item.issued || 0), 0)}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">Units distributed</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                    <p className="text-gray-600 text-sm font-medium mb-2">Damaged</p>
                    <p className="text-3xl font-bold text-red-600">
                        {uniformItems.reduce((sum, item) => sum + (item.damaged || 0), 0)}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">Units damaged</p>
                </div>
            </div>

            {/* Add Form Button */}
            {!showForm && (
                <div className="mb-6">
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Add Uniform Item
                    </button>
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {editingId ? 'Edit Uniform Item' : 'Add New Uniform Item'}
                    </h2>

                    <form onSubmit={handleAddUniformItem} className="space-y-6">
                        {/* Item Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Uniform Item Name *
                            </label>
                            <select
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Item</option>
                                {uniformNames.map(name => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter item description"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                rows="3"
                            />
                        </div>

                        {/* Sizes Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Sizes & Stock *
                                </label>
                                <button
                                    type="button"
                                    onClick={addSizeField}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    + Add Size
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.sizes.map((sizeObj, index) => (
                                    <div key={index} className="flex gap-3 items-end">
                                        {/* Size */}
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Size
                                            </label>
                                            <select
                                                value={sizeObj.size}
                                                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            >
                                                <option value="">Select Size</option>
                                                {formData.name && commonSizes[formData.name]?.map(size => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Stock */}
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                Stock
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={sizeObj.stock}
                                                onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                placeholder="0"
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        {formData.sizes.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSizeField(index)}
                                                className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reorder Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reorder Level
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.reorderLevel}
                                onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="20"
                            />
                            <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this level</p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search uniform items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 outline-none text-gray-700"
                    />
                </div>
            </div>

            {/* Uniform Items List */}
            <div className="space-y-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => {
                        const available = item.totalStock - (item.issued || 0) - (item.damaged || 0);
                        const isExpanded = expandedItems.has(item._id);

                        return (
                            <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Item Header */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                            {item.description && (
                                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-3 items-center">
                                            <button
                                                onClick={() => toggleExpanded(item._id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                            >
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-600" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleEditItem(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteItem(item._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Summary Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                        <div>
                                            <p className="text-gray-600 text-xs font-medium">Total Stock</p>
                                            <p className="text-2xl font-bold text-gray-900">{item.totalStock}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-xs font-medium">Issued</p>
                                            <p className="text-2xl font-bold text-blue-600">{item.issued || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-xs font-medium">Available</p>
                                            <p className="text-2xl font-bold text-green-600">{available}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-xs font-medium">Damaged</p>
                                            <p className="text-2xl font-bold text-red-600">{item.damaged || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-xs font-medium">Reorder Level</p>
                                            <p className="text-2xl font-bold text-yellow-600">{item.reorderLevel || 20}</p>
                                        </div>
                                    </div>

                                    {/* Low Stock Alert */}
                                    {available < item.reorderLevel && available > 0 && (
                                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-orange-600" />
                                            <p className="text-orange-800 text-sm font-medium">
                                                Low stock alert: Only {available} items available
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Expandable Sizes Details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                                        <h4 className="font-bold text-gray-900 mb-4">Size Breakdown</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {item.sizes.map((sizeObj, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                                                    <p className="text-gray-600 text-xs font-medium">Size</p>
                                                    <p className="text-lg font-bold text-gray-900">{sizeObj.size}</p>
                                                    <p className="text-gray-600 text-xs mt-2">Stock: {sizeObj.stock}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 text-lg">
                            {uniformItems.length === 0 ? 'No uniform items yet. Create one to get started!' : 'No matching items found'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniformInventory;