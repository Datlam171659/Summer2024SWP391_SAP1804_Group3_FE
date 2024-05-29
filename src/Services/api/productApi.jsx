import axios from "../axios/config"
const getProductAll = () => {
    return axios.get(`/api/Item`, {
    });
  };
  const getProductById=(itemId)=>{
    const response= axios.get(`/api/Item/${itemId}`)
  return response;
  }
  export {getProductAll,getProductById};