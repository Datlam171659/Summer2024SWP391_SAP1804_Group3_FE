import axios from "../axios/config";

const addwwarranty = (
    customerId
) => {
  return axios.post(`/api/Sales/Warranties`, {
    customerId
  });
};

export { addwwarranty };
