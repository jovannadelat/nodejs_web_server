const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesController')
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles')


// Route: /employees/
router.route('/')
    .get(employeesController.getAllEmployees) // go through middleware first and then employees controller
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    .put(employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),employeesController.deleteEmployee);

// Route: /employees/:id
router.route('/:id')
    .get(employeesController.getEmployee);

module.exports = router;
