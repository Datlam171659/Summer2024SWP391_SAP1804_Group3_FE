import axios from "../axios/config";

const addwwarranty = (
    customerId
) => {
  return axios.post(`/api/Sales/Invoices`, {
    customerId
  });
};

export { addwwarranty };
