import axios from 'axios';

const baseURL = 'https://gjewellery.bsite.net/api/Customer';

const getAllCustomers = async (searchValue = '') => { 
    const response = await axios.get(`${baseURL}?search=${searchValue}`);
    return response.data;
};

const addCustomer = async (customerData) => {
    const response = await axios.post(baseURL, customerData);
    return response.data;
}

const updateCustomer = async (customerId, customerData) => {
    const response = await axios.put(`${baseURL}/${customerId}`, customerData);
    return response.data;
}

export default { 
    getAllCustomers, 
    addCustomer, 
    updateCustomer 
};