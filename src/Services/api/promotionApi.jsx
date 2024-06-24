import axios from "../axios/config";
const requestPromotion = (id,code,discountPct,status,cusID) => {
  return axios.post(`/api/CustomerPromotion`, {id,code,discountPct,status,cusID});
};
const promotionAll = () => {
  return axios.get(`/api/CustomerPromotion`);
};
const approvePromotionCus = (id) => {
    return axios.put(`/api/CustomerPromotion/approve/${id}`);
  };
  
export {requestPromotion,approvePromotionCus,promotionAll};
