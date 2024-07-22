import axios from 'axios';

const multiplierApi = 'https://664cb68fede9a2b5565150ad.mockapi.io/login/multiplier';

export const getMultipliers = async () => {
  try {
    const response = await axios.get(multiplierApi);
    return response.data;
  } catch (error) {
    console.error("Error fetching multipliers:", error);
    throw error;
  }
};

export const updateMultipliers = async (newValues) => {
  try {
    const response = await axios.put(multiplierApi, newValues);
    return response.data;
  } catch (error) {
    console.error("Error updating multipliers:", error);
    throw error;
  }
};