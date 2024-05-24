import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../../Features/product/productSlice";
import { Card } from "antd";
const { Meta } = Card;
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
  return (
    <div>
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
  );
};

export default ProductListSale;
