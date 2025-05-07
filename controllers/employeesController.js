const Employee = require('../model/Employee');

// GET all employees
const getAllEmployees = async (req, res) => {
    const employee = await Employee.find();
    if (!employees) return res.status(204).json({'message':'No employees found.'});
        res.json(employees);
};

// POST new employee
const createNewEmployee = async (req, res) => {
    if (!rew?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({'message': 'first and last name required'});
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(result);

    } catch (err) {
        console.error(err);
    }
};

// PUT update employee
const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({'message':'ID parameter is required.'});
    }

    const employee = await Employee.findOne({_id: req.body.id}).exec();

    if (!employee) {
        return res.status(204).json({ message: `No employee matches ID ${req.body.id}` });
    }

    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);

};

// DELETE employee
const deleteEmployee = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({'message':'Employee ID required'});
    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({ message: `No employee matches ID ${req.body.id}` });
    }
    const result = await employee.deleteOne({_id: req.body.id});
    res.json(result);
};

// GET one employee by ID
const getEmployee = async (req, res) => {
    if (!req?.param?.id)return res.status(400).json({'message':'Employee ID required'});
    const employee = await Employee.findOne({_id: req.param.id}).exec();
    if (!employee) {
        return res.status(204).json({ message: `No employee matches ID ${req.body.id}` });
    }
    res.json(employee);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};
