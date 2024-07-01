import React, { useEffect, useState } from "react";
import "./Product.scss"
import { Button, message, Table, Modal, Form, Input, InputNumber, Spin } from "antd";
import { fetchProductData } from "../../Features/product/productSlice";
import { MinusCircleOutlined, EditOutlined, FileAddFilled, DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { removeProduct } from "../../Features/product/productdeleteSlice";
import { addProduct } from "../../Features/product/productaddSlice";
import { editProduct } from "../../Features/product/producteditSlice";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../firebase/ImageFirebase";
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
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      message.error('Chỉ chấp nhận các định dạng ảnh (JPEG, PNG, JPG)');
      return false;
    }

    if (file.size > maxSize) {
      message.error('Kích thước ảnh không được vượt quá 5MB');
      return false;
    }

    return true;
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
    if (!selectedFiles) {
      message.error("Vui lòng upload ảnh trước khi thêm sản phẩm!");
      return;
    }

    form
      .validateFields()
      .then((values) => {
        const productData = {
          ...values,
          itemImagesId: selectedFiles.url,
        };
        dispatch(addProduct(productData))
          .then(() => {
            message.success("Thêm sản phẩm thành công");
            dispatch(fetchProductData());
            form.resetFields();
            setSelectedFiles(null);
          })
          .catch((error) => {
            message.error("Thêm sản phẩm thất bại");
          });
        setIsAddModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Xác thực thất bại:", errorInfo);
      });
  };

  const handleUpload = async (file) => {
    if (!file) {
      message.error('Không có file được chọn');
      return;
    }
    setUploading(true);
    try {
      const storageRef = ref(storage, `uploads/${file.name + v4()}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setSelectedFiles({ name: file.name, url: downloadUrl });
      message.success('Tải lên thành công!');
    } catch (error) {
      message.error('Tải lên thất bại!');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      handleUpload(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFiles(null);
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
    setSelectedFiles(null);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "itemId",
      key: "itemId",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Hàng",
      dataIndex: "itemId",
      key: "itemId",


    },
    {
      title: "Tên Hàng",
      dataIndex: "itemName",
      key: "itemName",
      render: (text, record) => (
        <Link to={`/product/productdetail/${record.itemId}`}>{text}</Link>
      )
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại Vàng",
      dataIndex: "goldType",
      key: "goldType",
      width: 100,
      render: (_, record) => {
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }
        return goldType;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
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
          <div className="flex">
            <div className="mr-8">
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
              <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Trạng Thái" rules={[{ required: true, message: 'Vui lòng nhập trạng thái' }]}>
                <Input />
              </Form.Item>
            </div>
            <div>
              <Form.Item label="Hình ảnh" >
                <div className="uploadFile">
                  <input
                    id="selectFile" type="file" onChange={handleFileChange} style={{ display: "none" }}
                  />
                  <label htmlFor="selectFile">
                    <FileAddFilled /><span className="ml-[7px]">Chọn ảnh</span>
                  </label>
                  {selectedFiles && (
                    <div className="selectedFiles">
                      <div className="selectedFile">
                        <a href={selectedFiles.url} target="_blank" rel="noopener noreferrer">
                          {selectedFiles.name}
                        </a>
                        <button
                          className="removeMaterialBtn"
                          onClick={removeSelectedFile}
                        >
                          <DeleteFilled />
                        </button>
                      </div>
                    </div>
                  )}
                </div></Form.Item>
            </div>
          </div>


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
          <Form.Item name="quantity" label="Số lượng" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
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
