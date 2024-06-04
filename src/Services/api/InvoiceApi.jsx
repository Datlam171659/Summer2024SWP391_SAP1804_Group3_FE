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
    subTotal
  });
};

export { addinvoice };
