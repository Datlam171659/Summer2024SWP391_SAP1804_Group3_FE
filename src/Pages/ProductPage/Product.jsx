import React, { useEffect, useState } from "react";
import { Button, message, Table, Modal, Form, Input, InputNumber } from "antd";
import { fetchProductData } from "../../Features/product/productSlice";
import { MinusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { removeProduct } from "../../Features/product/productdeleteSlice";
import { addProduct } from "../../Features/product/productaddSlice";
import { editProduct } from "../../Features/product/producteditSlice";
import { Link } from "react-router-dom";
function Product() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productData);
  const isLoadingProductData = useSelector(
    (state) => state.product.isLoadingProductData
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();

  const showDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const showEditModal = (product) => {
    setSelectedProduct(product);
    form.setFieldsValue(product); 
    setIsEditModalOpen(true);
  };

  const handleDeleteOk = () => {
    dispatch(removeProduct(selectedProduct.itemId))
      .then(() => {
        message.success("Sản phẩm xóa thành công");
        dispatch(fetchProductData());
      })
      .catch((error) => {
        message.error("Xóa sản phẩm thất bại");
      });
    setIsModalOpen(false);
  };

  const handleAddOk = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(addProduct(values))
          .then(() => {
            message.success("Thêm sản phẩm thành công");
            dispatch(fetchProductData());
            form.resetFields();
          })
          .catch((error) => {
            message.error("Thêm sản phẩm thất bại");
          });
        setIsAddModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("xác thực thất bại:", errorInfo);
      });
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(editProduct({ itemId: selectedProduct.itemId, productDetails: values }))
          .then(() => {
            message.success("Sản phẩm cập nhật thành công");
            dispatch(fetchProductData());
            form.resetFields();
          })
          .catch((error) => {
            message.error("Cập nhật sản phẩm thất bại");
          });
        setIsEditModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Xác thực thất bại:", errorInfo);
      });
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Hàng",
      dataIndex: "serialNumber",
      key: "serialNumber",
  
          
    },
    {
      title: "Tên Hàng",
      dataIndex: "itemName",
      key: "itemName",
      render: (text, record) =>(
        <Link to={`/product/productdetail/${record.itemId}`}>{text}</Link>
      )    
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            className="text-green-400 hover:text-green-800 transition duration-200"
            onClick={() => showEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            onClick={() => showDeleteModal(record)}
            className="text-red-500 hover:text-red-700 transition duration-200"
          >
            <MinusCircleOutlined />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  return (
    <div className="p-4 flex-col justify-center align-middle w-full mt-10 ">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold uppercase">Sản phẩm</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsAddModalOpen(true)}>Thêm Sản Phẩm</Button>
          <Button>Lọc</Button>
          <Button>Tải sản phẩm</Button>
        </div>
      </div>
      <div>
        <Table
          dataSource={productData}
          columns={columns}
          rowKey="itemId"
          pagination={{ position: ["bottomCenter"] }}
          loading={isLoadingProductData}
          className="w-full"
        />
      </div>
      <Modal
        title="Xác nhận xóa sản phẩm"
        open={isModalOpen}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        footer={
          <div className="text-right">
            <Button onClick={handleDeleteCancel} className="mr-3">
              Hủy
            </Button>
            <Button onClick={handleDeleteOk} type="primary">
              Xác nhận
            </Button>
          </div>
        }
      >
        <p>Bạn có chắc muốn xóa sản phẩm không?</p>
      </Modal>
      <Modal
        title="Thêm sản phẩm mới"
        open={isAddModalOpen}
        footer={
          <div className="text-right">
            <Button onClick={handleAddCancel} className="mr-3">
              Hủy
            </Button>
            <Button onClick={handleAddOk} type="primary">
              Xác nhận
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="itemId" label="Mã Hàng" rules={[{ required: true, message: 'Vui lòng nhập mã hàng' }]}>
            <Input />
          </Form.Item>
        
          <Form.Item name="brandId" label="Mã Thương Hiệu" rules={[{ required: true, message: 'Vui lòng nhập mã thương hiệu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="accessoryType" label="Loại Phụ Kiện" rules={[{ required: true, message: 'Vui lòng nhập loại phụ kiện' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="serialNumber" label="serialNumber" rules={[{ required: true, message: 'Vui lòng nhập serialNumber' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="itemName" label="Tên Hàng" rules={[{ required: true, message: 'Vui lòng nhập tên hàng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô Tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="size" label="Kích Thước" rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="weight" label="Trọng Lượng" rules={[{ required: true, message: 'Vui lòng nhập trọng lượng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng Thái" rules={[{ required: true, message: 'Vui lòng nhập trạng thái' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chỉnh sửa sản phẩm"
        open={isEditModalOpen}
        footer={
          <div className="text-right">
            <Button onClick={handleEditCancel} className="mr-3">
              Hủy
            </Button>
            <Button onClick={handleEditOk} type="primary">
              Xác nhận
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="itemId" label="Mã Hàng" rules={[{ required: true, message: 'Vui lòng nhập mã hàng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="brandId" label="Mã Thương Hiệu" rules={[{ required: true, message: 'Vui lòng nhập mã thương hiệu' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="accessoryType" label="Loại Phụ Kiện" rules={[{ required: true, message: 'Vui lòng nhập loại phụ kiện' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="serialNumber" label="serialNumber" rules={[{ required: true, message: 'Vui lòng nhập serialNumber' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="itemName" label="Tên Hàng" rules={[{ required: true, message: 'Vui lòng nhập tên hàng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô Tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="size" label="Kích Thước" rules={[{ required: true, message: 'Vui lòng nhập kích thước' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="weight" label="Trọng Lượng" rules={[{ required: true, message: 'Vui lòng nhập trọng lượng' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng Thái" rules={[{ required: true, message: 'Vui lòng nhập trạng thái' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Product;
