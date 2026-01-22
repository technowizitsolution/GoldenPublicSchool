import express from 'express';
import * as uniformController from '../../controllers/uniformController.js';
import adminAuth from '../../middlewares/adminAuth.js';

const adminUniformRouter = express.Router();


// UNIFORM ITEMS
adminUniformRouter.get('/items', uniformController.getAllUniformItems);
adminUniformRouter.post('/items', adminAuth, uniformController.createUniformItem);
adminUniformRouter.put('/items/:id', adminAuth, uniformController.updateUniformItem);
adminUniformRouter.delete('/items/:id', adminAuth, uniformController.deleteUniformItem);

// LOW STOCK
adminUniformRouter.get('/items/low-stock', uniformController.getLowStockItems);

// STUDENT UNIFORMS
adminUniformRouter.get('/class/:classId', uniformController.getStudentUniformsByClass);
adminUniformRouter.get('/student/:studentId', uniformController.getStudentUniformDetails);
adminUniformRouter.post('/issue', adminAuth, uniformController.issueUniformToStudent);
adminUniformRouter.put('/condition', adminAuth, uniformController.updateUniformCondition);

// CLASS STATISTICS 
adminUniformRouter.get('/stats/class/:classId', uniformController.getClassUniformStats);
adminUniformRouter.get('/stats/all-classes', uniformController.getAllClassesUniformSummary);

// INVENTORY
adminUniformRouter.get('/inventory/history', uniformController.getInventoryHistory);
adminUniformRouter.post('/inventory/add', adminAuth, uniformController.addInventory);

//  REPORTS 
adminUniformRouter.get('/reports/summary', uniformController.getUniformReport);

export default adminUniformRouter;