import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail } from '../../Features/product/productdetailSlice'; 
import { editProduct } from '../../Features/product/producteditSlice'; 
import { useParams } from 'react-router-dom';
import { message, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
function ProductDetail() {
  const dispatch = useDispatch();
  const { itemId } = useParams(); 
  const { productDataDetail: product, isLoadingProductDetail, isError } = useSelector(state => state.productDetail);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProduct, setEditableProduct] = useState({});

  useEffect(() => {
    if (itemId) {
      dispatch(fetchProductDetail(itemId));
    }
  }, [dispatch, itemId]);

  useEffect(() => {
    if (product) {
      setEditableProduct(product);
    }
  }, [product]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    dispatch(editProduct({ itemId: editableProduct.itemId, productDetails: editableProduct }))
      .then(() => {
        message.success("Sản phẩm cập nhật thành công");
        setIsEditing(false);
        dispatch(fetchProductDetail(itemId));
      })
      .catch((error) => {
        message.error("Sản phẩm cập nhật thất bại");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  if (isLoadingProductDetail) {
    return <div className="text-center">Đang lấy thông tin....</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Lỗi trong quá trình lấy thông tin</div>;
  }

  if (!product) {
    return <div className="text-center">Không tìm thấy sản phẩm</div>;
  }

  return (
    <div className="w-full flex flex-col bg-white p-6 align-middle">
      <h1 className='text-2xl font-bold my-4'>Thông tin chi tiết</h1>
      <div className="flex justify-between items-center mb-6 w-full max-w-2xl">
        <h1 className="text-xl font-bold mt-9">Chi tiết</h1>
        {!isEditing && (
          <Button className='bg-white text-black text-center' type="primary" onClick={handleEditClick}>
                <EditOutlined />
          </Button>
        )}
        {isEditing && (
          <Button type="primary" onClick={handleSaveClick}>
            Lưu
          </Button>
        )}
      </div>
      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className='my-3'>
            <strong>Tên sản phẩm:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="itemName" 
                value={editableProduct.itemName || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.itemName}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>Mã hàng:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="itemId" 
                value={editableProduct.itemId || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
                readOnly
              />
            ) : (
              <span className="ml-2">{product.itemId}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>Loại hàng:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="accessoryType" 
                value={editableProduct.accessoryType || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.accessoryType}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>serialNumber:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="serialNumber" 
                value={editableProduct.serialNumber || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.serialNumber}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>Mô tả:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="description" 
                value={editableProduct.description || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.description}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>Tình trạng:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="status" 
                value={editableProduct.status || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.status}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>Kích thước:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="size" 
                value={editableProduct.size || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.size}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>Số lượng:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="weight" 
                value={editableProduct.weight || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.weight}</span>
            )}
          </div>
          <div className='my-3'>
            <strong>Giá tiền:</strong> 
            {isEditing ? (
              <input 
                type="text" 
                name="price" 
                value={editableProduct.price || ''} 
                onChange={handleChange} 
                className="ml-2 border p-1"
              />
            ) : (
              <span className="ml-2">{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
