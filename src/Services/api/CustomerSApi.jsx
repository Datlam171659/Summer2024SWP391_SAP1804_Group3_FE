import axios from "../axios/config"
const getCustomerAll = () => {
    return axios.get(`/api/Customer`, {
    });
  };
  const getCustomerById=(id)=>{
    const response= axios.get(`/api/Customer/${id}`)
  return response;
  }
 const getCustomerByPhone=(phoneNumber)=>{
  const response= axios.get(`/api/Customer/phone/${phoneNumber}`)
return response;
}
const rewardCustomer = (customerId,pointsTotal) => {
  return axios.post(`/api/RewardsProgram`, {customerId,pointsTotal});
};
  export{getCustomerAll,getCustomerById,getCustomerByPhone,rewardCustomer}