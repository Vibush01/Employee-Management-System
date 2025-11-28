const mongoose = require('mongoose');
const Counter = require('./Counter');

const employeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 100
    },
    department: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    designation: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    salary: {
        type: Number,
        required: true
    },
    joining_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

employeeSchema.pre('save', async function () {
    if (!this.isNew) return;

    const counter = await Counter.findByIdAndUpdate(
        { _id: 'employeeId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    this.id = counter.seq;
});

module.exports = mongoose.model('Employee', employeeSchema);
