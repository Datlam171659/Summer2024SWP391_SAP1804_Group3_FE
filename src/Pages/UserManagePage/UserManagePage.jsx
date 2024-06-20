import React, { useState, useEffect } from "react";
import { Input, Table, Space, Button, Modal, message, Form, Select, Statistic, Card, Row, Col, ConfigProvider, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './UserManagePage.scss'
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Features/User/userListSlice";
import { addUser } from "../../Features/User/userAddSlice";

export default function UserManagePage() {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const isLoading = useSelector((state) => state.user.isLoading);

  const numManagers = userData.filter(user => user.roleId === 1).length;
  const numStaff = userData.filter(user => user.roleId === 2).length;
  const numActive = userData.filter(user => user.status.toLowerCase() === "active").length;
  const numInactive = userData.filter(user => user.status.toLowerCase() === "inactive").length;

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleUpdate = (record) => {
    form.setFieldsValue({
      fullName: record.fullName,
      role: record.roleId,
      address: record.address,
      phoneNumber: record.phoneNumber,
      gender: record.gender,
      status: record.status,
    });
    setCurrentUser(record);
    setIsModalVisible(true);
  };

  const getRoleNameById = (roleId) => {
    switch (roleId) {
      case 0:
        return "Admin";
      case 1:
        return "Manager";
      case 2:
        return "Staff";
      default:
        return "Unknown";
    }
  }

  const handleAddCancel = () => {
    setAddModalVisible(false);
    form.resetFields();
  };

  const handleAddOk = () => {
    form
      .validateFields()
      .then((values) => {
        const newUser = {
          roleId: values.role,
          stationId: null,
          fullName: values.fullName,
          userName: values.email,
          passwordHash: values.passwordHash,
          address: values.address,
          phoneNumber: values.phoneNumber,
          gender: values.gender,
          status: "Active",
          email: values.email,
        };
        dispatch(addUser(newUser))
          .then(() => {
            dispatch(fetchUserData());
            form.resetFields();
            message.success("Thêm nhân viên thành công");
          })
          .catch((error) => {
            message.error("Thêm sản phẩm thất bại");
          });
        setAddModalVisible(false);
      })
      .catch((errorInfo) => {
        console.log("xác thực thất bại:", errorInfo);
      });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: 'key',
      key: 'key',
      width: 50,
    },
    {
      title: "Mã",
      dataIndex: "staffId",
      key: 'staffId',
      width: 120,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: 'fullName',
      width: 150,
    },
    {
      title: "Vai trò",
      dataIndex: "roleId",
      key: 'roleId',
      render: (roleId) => getRoleNameById(roleId)
    },
    {
      title: "Email",
      dataIndex: "email",
      key: 'email'
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: 'address',
      width: 550,
      class: "[word-wrap:break-word]"
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: 'phoneNumber'
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        text.toLowerCase() === "active" ?
          <Tag color="green">Active</Tag> :
          <Tag color="red">Inactive</Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => handleUpdate(record)} />
          <DeleteOutlined />
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)"
        },
        components: {
          Select: {
            optionSelectedBg: "#dbdbdb"
          },
        },
      }}
    >
      <div className="user-manage-page">
        <div className="statistics-section">
          <Row className="statistics-box" justify="center" gutter={16}>
            <Col span={6} style={{ wordWrap: "break-word" }}>
              <Card>
                <Statistic
                  title="Managers"
                  value={numManagers}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Staff"
                  value={numStaff}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={<span className="active-title">Active</span>}
                  value={numActive}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={<span className="inactive-title">Inactive</span>}
                  value={numInactive}
                />
              </Card>
            </Col>
          </Row>
        </div>
        <div className="my-5 w-screen lg:w-full p-4">
          <div className="h-[40%] min-h-[485px] w-full lg:w-full text-center p-3 bg-[#FFFFFF] rounded-[7px] shadow-md">
            <div className="flex justify-between">
              <div className="w-[86%] flex justify-start">
                <Input className="search-input"
                  style={{ width: "89.7%", marginBottom: "5px" }}
                  placeholder="Search by name or email"
                  value={searchValue}
                  onChange={async event => { setSearchValue(event.target.value); }}
                  allowClear
                />
                <Button
                  type="primary"
                  className="ml-2"
                  style={{ fontWeight: "600", heigh: "30px", width: "9.6%" }}
                  loading={loading}>
                  Tìm kiếm
                </Button>
              </div>
              <div className="w-[11%]">
                <Button
                  onClick={() => setAddModalVisible(true)}
                  className="add-user-btn"
                  type="primary"
                  style={{ width: "100%", fontWeight: "600" }}
                >
                  Thêm nhân viên
                </Button>
              </div>
            </div>

            <div className="cart-items flex flex-col items-center space-y-8 w-full ">
              <Table
                columns={columns}
                dataSource={userData}
                loading={isLoading}
                rowKey="id"
                style={{ marginTop: 5, }}
                className="w-full rounded-[5px] font-medium"
                fixed
              />
            </div>
          </div>

          <Modal
            title="Update User"
            visible={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                const updatedUsers = userData.map((user) =>
                  user.id === currentUser.id ? { ...user, ...values } : user
                );
                setIsModalVisible(false);
                message.success("Thông tin nhân viên đã được cập nhật!");
              }}
            >
              <Form.Item
                label="Tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Select.Option value={0}>Admin</Select.Option>
                  <Select.Option value={1}>Manager</Select.Option>
                  <Select.Option value={2}>Staff</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="Male">Nam</Select.Option>
                  <Select.Option value="Female">Nữ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Đặt lại mật khẩu"
                name="resetPassword"
                rules={[
                  { required: false, message: 'Nhập mật khẩu mới' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới hoặc để trống để giữ mật khẩu hiện tại" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Thêm nhân viên"
            visible={isAddModalVisible}
            onCancel={() => {
              setAddModalVisible(false);
              form.resetFields();
            }}
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
            <Form
              form={form}
              layout="vertical"
              onFinish={(values) => {
                const updatedUsers = userData.map((user) =>
                  user.id === currentUser.id ? { ...user, ...values } : user
                );
                setIsModalVisible(false);
                message.success("Thông tin nhân viên đã được cập nhật!");
              }}
            >
              <Form.Item
                label="Tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Vai trò"
                name="role"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Select.Option value={0}>Admin</Select.Option>
                  <Select.Option value={1}>Manager</Select.Option>
                  <Select.Option value={2}>Staff</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="Male">Nam</Select.Option>
                  <Select.Option value="Female">Nữ</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="passwordHash"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  )
};
