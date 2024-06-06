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
          return customerData ;
        } else {
          throw new Error(responseData.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching customer information!", error);
        throw error;
      });
  },
  searchCustomerByPhoneNumber: (phoneNumber) => {
    return axiosClient.get(`/api/Customer/search?phoneNumber=${phoneNumber}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error("There was an error searching for customers!", error);
        throw error;
      });
  }
};

export default buyBackApi;
