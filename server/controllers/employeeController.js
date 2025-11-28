const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// Helper to construct query based on ID type
const getQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    return { id: id };
};

// Get all employees with pagination, search, filter, and sort
exports.getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, department, designation, sort, order } = req.query;

        const query = {};

        // Search (Name, Email, or ID)
        if (search) {
            const searchConditions = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];

            // If search is a number, add ID search
            if (!isNaN(search)) {
                searchConditions.push({ id: Number(search) });
            }

            query.$or = searchConditions;
        }

        // Filters
        if (department) query.department = department;
        if (designation) query.designation = designation;

        // Sorting
        const sortOptions = {};
        if (sort) {
            sortOptions[sort] = order === 'desc' ? -1 : 1;
        } else {
            sortOptions.createdAt = -1; // Default sort by newest
        }

        const employees = await Employee.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Employee.countDocuments(query);

        res.status(200).json({
            employees,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalEmployees: count
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single employee
exports.getEmployeeById = async (req, res) => {
    try {
        const query = getQuery(req.params.id);
        const employee = await Employee.findOne(query);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create employee
exports.createEmployee = async (req, res) => {
    try {
        const { email } = req.body;
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update employee
exports.updateEmployee = async (req, res) => {
    try {
        const query = getQuery(req.params.id);
        const updatedEmployee = await Employee.findOneAndUpdate(
            query,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const query = getQuery(req.params.id);
        const deletedEmployee = await Employee.findOneAndDelete(query);
        if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
