import axios from 'axios';

const baseURL = 'https://gjewellery.bsite.net/api/Customer';

const getAllCustomers = async (searchValue = '') => { 
    const response = await axios.get(`${baseURL}?search=${searchValue}`);
    return response.data;
};

export default { getAllCustomers };