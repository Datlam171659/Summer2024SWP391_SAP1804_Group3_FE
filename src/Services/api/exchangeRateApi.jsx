import React from 'react';
import axios from 'axios';

const currencyURL = 'https://gjewellery.bsite.net/api/ExternalAPI/ExchangeRate/vnd';

const getVNDExchangeRate = async () => {
  try {
    const response = await axios.get(currencyURL);
    const responseData = response.data;

    if (responseData) { 
      const VND = responseData.data;
      return VND;
    } else {
      throw new Error('Failed to fetch VND exchange rate');
    }
  } catch (error) {
    console.error("Error fetching VND exchange rate:", error);
    throw error;
  }
};

export default getVNDExchangeRate;