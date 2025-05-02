const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController')


// Route: /employees/
router.route('/')
    .get(employeesController.getAllEmployees) // go through middleware first and then employees controller
    .post(employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

// Route: /employees/:id
router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;
