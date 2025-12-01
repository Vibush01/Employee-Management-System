import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, getEmployeeById, updateEmployee } from '../services/api';

const EmployeeForm = () => {
    const { register, handleSubmit, setValue, reset, setError: setErrorField, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchEmployee();
        } else {
            reset(); // Reset form when switching to add mode
        }
    }, [id]);

    const fetchEmployee = async () => {
        try {
            const data = await getEmployeeById(id);
            if (data.joining_date) {
                data.joining_date = new Date(data.joining_date).toISOString().split('T')[0];
            }
            Object.keys(data).forEach(key => {
                setValue(key, data[key]);
            });
        } catch (err) {
            setError('Failed to fetch employee details');
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        try {
            if (isEditMode) {
                await updateEmployee(id, data);
            } else {
                await createEmployee(data);
            }
            reset(); // Reset form after success
            navigate('/');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';
            if (errorMessage === 'Email already exists') {
                setErrorField('email', { type: 'manual', message: errorMessage });
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {isEditMode ? 'Edit Employee' : 'Add New Employee'}
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        {...register('name', {
                            required: 'Name is required',
                            maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            maxLength: { value: 100, message: 'Email cannot exceed 100 characters' },
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email format"
                            }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                        {...register('department', { required: 'Department is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                    >
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                    </select>
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                </div>

                {/* Designation */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <select
                        {...register('designation', { required: 'Designation is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                    >
                        <option value="">Select Designation</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Senior Engineer">Senior Engineer</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Manager">Manager</option>
                        <option value="HR Executive">HR Executive</option>
                        <option value="Sales Representative">Sales Representative</option>
                    </select>
                    {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message}</p>}
                </div>

                {/* Salary */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                    <input
                        type="number"
                        {...register('salary', { required: 'Salary is required', min: 0 })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                    {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary.message}</p>}
                </div>

                {/* Joining Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                    <input
                        type="date"
                        {...register('joining_date', { required: 'Joining Date is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                    {errors.joining_date && <p className="text-red-500 text-xs mt-1">{errors.joining_date.message}</p>}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        {...register('status')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Add Employee')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
