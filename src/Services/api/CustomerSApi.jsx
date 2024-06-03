import axios from "../axios/config"
const getCustomerAll = () => {
    return axios.get(`/api/Customer`, {
    });
  };
  const getCustomerById=(id)=>{
    const response= axios.get(`/api/Customer/${id}`)
  return response;
  }
  export{getCustomerAll,getCustomerById}