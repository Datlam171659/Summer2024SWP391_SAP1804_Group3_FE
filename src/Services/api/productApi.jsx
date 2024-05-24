import axios from "axios";
const getProductAll = () => {
    return axios.get(`https://65450fc75a0b4b04436d8f9a.mockapi.io/Item`, {
    });
  };
  export {getProductAll};