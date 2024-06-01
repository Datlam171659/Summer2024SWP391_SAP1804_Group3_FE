import axios from 'axios';

const baseURL = 'https://localhost:7262/api/Customer';

const getAllCustomers = async (searchValue = '') => { 
    const response = await axios.get(`${baseURL}?search=${searchValue}`);
    
    // Check if response.data is an object and it has a property named 'data'
    if(typeof response.data === 'object' && response.data.hasOwnProperty('data')) {
      return response.data.data;
    }

    // Return an empty array if we don't get the response in the expected format
    return [];
};

const getCustomerByEmail = async (email) => {
    const encodedEmail = encodeURIComponent(email); // Add this line
    const response = await axios.get(`${baseURL}/email/${encodedEmail}`); // Use encodedEmail here
    return response.data;
}

const getCustomerByPhoneNumber = async (phoneNumber) => {
    const response = await axios.get(`${baseURL}/phone/${phoneNumber}`); // It should be baseURL, not bjaseURL
    return response.data;
}

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
    updateCustomer,
    getCustomerByEmail,
    getCustomerByPhoneNumber
};