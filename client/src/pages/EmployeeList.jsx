import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useNavigate } from 'react-router-dom';
import { getEmployees, deleteEmployee } from '../services/api';
import Modal from '../components/Modal';
import { FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [sort, setSort] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    // Modal states
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const navigate = useNavigate();

    const fetchEmployees = async (reset = false) => {
        try {
            const currentPage = reset ? 1 : page;
            const params = {
                page: currentPage,
                limit: 10,
                search,
                department,
                designation,
                sort,
                order
            };

            const data = await getEmployees(params);

            if (reset) {
                setEmployees(data.employees);
                setPage(2);
            } else {
                setEmployees(prev => [...prev, ...data.employees]);
                setPage(prev => prev + 1);
            }

            if (data.employees.length === 0 || employees.length + data.employees.length >= data.totalEmployees) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEmployees(true);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, department, designation, sort, order]);



    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await deleteEmployee(employeeToDelete.id || employeeToDelete._id);
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
            fetchEmployees(true); // Refresh list
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    };

    const handleViewClick = (employee) => {
        setSelectedEmployee(employee);
        setIsViewModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, email or UID..."
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 bg-white"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        <option value="">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                    </select>

                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 bg-white"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    >
                        <option value="">All Designations</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Senior Engineer">Senior Engineer</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Manager">Manager</option>
                        <option value="HR Executive">HR Executive</option>
                        <option value="Sales Representative">Sales Representative</option>
                    </select>

                    <select
                        className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2 bg-white"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="createdAt">Newest First</option>
                        <option value="name">Name</option>
                        <option value="salary">Salary</option>
                    </select>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <InfiniteScroll
                    dataLength={employees.length}
                    next={() => fetchEmployees(false)}
                    hasMore={hasMore}
                    loader={<div className="p-4 text-center text-gray-500">Loading more employees...</div>}
                    endMessage={<div className="p-4 text-center text-gray-500">No more employees to show</div>}
                >
                    <ul className="divide-y divide-gray-200">
                        {employees.map((employee) => (
                            <li key={employee.id || employee._id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-indigo-600 truncate">{employee.name}</p>
                                                <div className="ml-2 flex-shrink-0 flex">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {employee.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:flex sm:justify-between">
                                                <div className="sm:flex">
                                                    <p className="flex items-center text-sm text-gray-500 mr-6">
                                                        {employee.designation}
                                                    </p>
                                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                        {employee.department}
                                                    </p>
                                                </div>
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <p>
                                                        Salary: ₹{employee.salary.toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex-shrink-0 flex space-x-2">
                                            <button
                                                onClick={() => handleViewClick(employee)}
                                                className="p-2 text-gray-400 hover:text-gray-500"
                                                title="View Details"
                                            >
                                                <FaEye className="h-5 w-5" />
                                            </button>
                                            <Link
                                                to={`/edit/${employee.id || employee._id}`}
                                                className="p-2 text-indigo-400 hover:text-indigo-500"
                                                title="Edit"
                                            >
                                                <FaEdit className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(employee)}
                                                className="p-2 text-red-400 hover:text-red-500"
                                                title="Delete"
                                            >
                                                <FaTrash className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </InfiniteScroll>
            </div>

            {/* View details modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="Employee Details"
            >
                {selectedEmployee && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE UID</label>
                            <p className="text-sm font-medium text-gray-900">{selectedEmployee.id || selectedEmployee._id}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
                            <p className="text-sm font-medium text-gray-900">{selectedEmployee.name}</p>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                            <p className="text-sm text-gray-900">{selectedEmployee.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Department</label>
                                <p className="text-sm text-gray-900">{selectedEmployee.department}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</label>
                                <p className="text-sm text-gray-900">{selectedEmployee.designation}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</label>
                                <p className="text-sm text-gray-900">₹{selectedEmployee.salary.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Joining Date</label>
                                <p className="text-sm text-gray-900">{new Date(selectedEmployee.joining_date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedEmployee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {selectedEmployee.status}
                            </span>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
            >
                <div>
                    <p className="text-sm text-gray-500">
                        Are you sure you want to delete employee <span className="font-bold text-gray-900">{employeeToDelete?.name}</span>? This action cannot be undone.
                    </p>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={confirmDelete}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EmployeeList;
