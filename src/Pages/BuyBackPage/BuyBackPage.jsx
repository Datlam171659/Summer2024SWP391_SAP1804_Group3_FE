import React, { useEffect } from 'react';
import ProductListBuyBack from './ProductListBuyBack';
import "./BuyBackPage.scss"
import { ConfigProvider } from 'antd';

const BuyBackPage = () => {
 
  return (
    <div className='buy-back-page'>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "var(--primary-color)",
            colorPrimaryHover: "var(--primary-color-hover)"
          },
        }}
      >
        <ProductListBuyBack />
      </ConfigProvider>
    </div>
  );
};

export default BuyBackPage;
