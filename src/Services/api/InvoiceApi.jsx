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
const createInvoice = (
  staffId,
  customerId,
  invoiceNumber,
  companyName,
  buyerName,
  buyerAddress,
  status,
  paymentType,
  quantity,
  subtotal,
  createdDate,
  items
) => {
  return axios.post('/api/Sales/CreateInvoiceWithItems', {
    invoiceDTO: {
      staffId,
      customerId,
      invoiceNumber,
      companyName,
      buyerName,
      buyerAddress,
      status,
      paymentType,
      quantity,
      subtotal,
      createdDate,
    },
    items: items.map(item => ({
      itemID: item.itemID,
      itemQuantity: item.itemQuantity,
      warrantyExpiryDate: item.warrantyExpiryDate,
      returnPolicyId :item.returnPolicyId,
    })),
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};


const getinvoiceAll = () => {
  return axios.get(`/api/Sales/Invoices`, {});
};

const GetMonthlyRevenue = () => {
  return axios.get(`/api/Sales/MonthlyRevenue`, {});
}
export { addinvoice,getinvoiceAll, GetMonthlyRevenue,createInvoice };
