import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../Features/product/productSlice";
import { Card } from "antd";
import './SalesPage.scss'
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
const ProductListSale = () => {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productData);
  const isLoadingProductData = useSelector(
    (state) => state.product.isLoadingProductData
  );
  const isError = useSelector((state) => state.product.isError);
  console.log(productData);
  useEffect(() => {
    dispatch(fetchProductData());
  }, []);
  if (isError === true && isLoadingProductData === false) {
    return <div>Something wrong!try again</div>;
  }
  const { Search } = Input;
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1677ff',
    }}
  />
);
  return (
    <div className="flex">
    <div className="productlist grid grid-rows-2 grid-flow-col gap-4" > 
      {productData.map((item) => (
        <div key={item.id} className="">
          <Card
            hoverable
            style={{
              width: 240,
            }}
            cover={
              <img
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              />
            }
          >
            <h1>{item.Tittle}</h1>
          </Card>
        </div>
      ))}
    </div>
    <div>
      <h1>
        Order 
      </h1>
    </div>
    </div>
  );
};

export default ProductListSale;
