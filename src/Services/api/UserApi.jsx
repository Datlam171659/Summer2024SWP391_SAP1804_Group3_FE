import axiosClient from "../axios/config";

const userkApi = {
  getUserListApi: () => {
    return axiosClient.get('/api/Employee/Staff')
      .then(response => {
        const responseData = response.data;
        if (responseData) {
          return responseData;
        } else {
          throw new Error(response.message);
        }
      })
      .catch(error => {
        console.error("There was an error fetching user information!", error);
        throw error;
      });
  },
  createUser: (userInfo) => {
    return axiosClient.post('/api/Employee/Register', userInfo)
      .then(response => {
        if (response.data) {
          return response.data;
        } else {
          throw new Error(response.data.message);
        }
      })
      .catch(error => {
        console.error("There was an error creating the user!", error);
        throw error;
      });
  },


};

export default userkApi;
