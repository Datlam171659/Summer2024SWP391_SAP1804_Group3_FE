import axiosClient from "../axios/config";

const buyBackApi = {
  getItem: (id) => {
    return axiosClient.get(`/api/Item/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("There was an error fetching the item!", error);
        throw error;
      });
  },
  getCustomerInforApi: () => {
    return axiosClient.get('/api/Customer')
      .then(response => {
        const responseData = response.data;
        if (responseData.success) {
          const customerData = responseData.data;
          return customerData;
        } else {
          throw new Error(responseData.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching customer information!", error);
        throw error;
      });
  },
  createCustomer: (customerInfo) => {
    return axiosClient.post('/api/Customer', customerInfo)
      .then(response => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error creating the customer!", error);
        throw error;
      });
  },
  getInvoice: (id) => {
    return axiosClient.get(`/api/Sales/InvoiceItems/${id}`)
      .then(response => {
        return response.data.data;
      })
      .catch(error => {
        console.error("There was an error fetching the invoice!", error);
        throw error;
      });
  },

};

export default buyBackApi;
