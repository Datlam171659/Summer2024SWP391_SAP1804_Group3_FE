import axios from "../axios/config";
const getProductAll = () => {
  return axios.get(`/api/Item`, {});
};
const getProductById = (itemId) => {
  const response = axios.get(`/api/Item/${itemId}`);
  return response;
};
const removeItem = (itemId) => {
  return axios.delete(`/api/Item/${itemId}`);
};
const addItem = (productDetails) => {
  return axios.post(`/api/Item`, productDetails);
};
const edititem = async (itemId, productDetails) => {
  return axios.put(`/api/Item/${itemId}`, productDetails, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
const reduceitem = async (itemId, quantity) => {
  return axios.put(`/api/Item/updateQuantity/${itemId}?quantity=${quantity}`);
};
export { getProductAll, getProductById, removeItem, addItem,edititem,reduceitem };
