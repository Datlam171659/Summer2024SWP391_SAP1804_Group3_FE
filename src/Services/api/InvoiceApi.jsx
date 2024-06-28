import axios from "../axios/config";

const addinvoice = (
  staffId,
  returnPolicyId,
  itemId,
  customerId,
  companyName,
  buyerAddress,
  status,
  paymentType,
  quantity,
  subTotal
) => {
  return axios.post(`/api/Sales/Invoices`, {
    staffId,
    returnPolicyId,
    itemId,
    customerId,
    companyName,
    buyerAddress,
    status,
    paymentType,
    quantity,
    subTotal,
  });
};
const getinvoiceAll = () => {
  return axios.get(`/api/Sales/Invoices`, {});
};

const GetMonthlyRevenue = () => {
  return axios.get(`/api/Sales/MonthlyRevenue`, {});
}
export { addinvoice,getinvoiceAll, GetMonthlyRevenue };
