import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

const api = axios.create({
    baseURL: API_URL,
});


api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export const getEmployees = async (params) => {
    const response = await api.get('/', { params });
    return response.data;
};

export const getEmployeeById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};

export const createEmployee = async (data) => {
    const response = await api.post('/', data);
    return response.data;
};

export const updateEmployee = async (id, data) => {
    const response = await api.put(`/${id}`, data);
    return response.data;
};

export const deleteEmployee = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
};

export default api;
