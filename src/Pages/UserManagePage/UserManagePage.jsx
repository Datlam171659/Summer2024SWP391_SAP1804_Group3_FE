import React, { useState, useEffect } from "react";
import { Input, Table, Space, Button, Modal, message, Form, Select, Statistic, Card, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import './UserManagePage.scss'
import { createEntityAdapter } from "@reduxjs/toolkit";

export default function UserManagePage() {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const numManagers = users.filter(user => user.roleId === 1).length;
  const numStaff = users.filter(user => user.roleId === 2).length;
  const numActive = users.filter(user => user.status === "Active").length;
  const numInactive = users.filter(user => user.status === "Inactive").length;
  const roleMap = {
    0: "Admin",
    1: "Manager",
    2: "Staff",
  };

  const userData = [
    {
        key: 1,
        id: 1,
        name: "User 1",
        roleId: 0,
        email: "user1@example.com",
        createDate: "2021-12-01",
        status: "Active",
        address: "123 Main St",
        phoneNumber: "123-456-7890",
        gender: "Male",
      },
      {
        key: 2,
        id: 2,
        name: "User 2",
        roleId: 1,
        email: "user2@example.com",
        status: "Active",
        // Sample data for the additional fields
        address: "123 Main St",
        phoneNumber: "123-456-7890",
        gender: "Male",
      },
      {
        key: 3,
        id: 3,
        name: "User 3",
        roleId: 2,
        email: "user3@example.com",
        status: "Active",
        // Sample data for the additional fields
        address: "123 Main St",
        gender: "Male",
      },
  ];

  useEffect(() => {
    setAllUsers(userData);
    setUsers(userData);
  }, []);

  const handleSearch = () => {
    if (searchValue === "") {
      setUsers(allUsers);
    } else {
      const filteredUsers = allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  const handleUpdate = (record) => {
    form.setFieldsValue({
        name: record.name,
        role: record.roleId,
        address: record.address,
        phoneNumber: record.phoneNumber,
        gender: record.gender,
        status: record.status,
    });
    setCurrentUser(record);
    setIsModalVisible(true);
  };

  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Are you sure to delete this user?",
      style: { top: '50%', transform: 'translateY(-50%)' },
      onOk() {
        // const remainingUsers = users.filter((user) => user.id !== userId);
        // setUsers(remainingUsers);
        // message.success(`User Id: ${userId} has been deleted.`);
      },
      onCancel() { },
    });
  };

  const handleAddUser = () => {
    navigate('/user/user-add');
    }

    const handleStatusChange = (value, id,) => {
        const index = users.findIndex(user => user.id === id);
        let tempUsers = [...users];
        tempUsers[index]['status'] = value;
        setUsers(tempUsers);
        setAllUsers(tempUsers);
        const userName = tempUsers[index]['name'];
        message.success(`${userName}: Status Updated`);
    }

  const columns = [
    {
      title: "No.",
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: "ID",
      dataIndex: "id",
      key: 'id',
    },
    {
      title: "Full Name",
      dataIndex: "name",
      key: 'name',
    },
    {
      title: "Role",
      dataIndex: "roleId",
      key: 'role_id',
      render: roleId => <div>{roleMap[roleId]}</div>
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text, record) => (
            <Select defaultValue={text} style={{width:100}} 
                onChange={(value) => handleStatusChange(value, record.id)}>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
        )
    },
    {
       title: "Actions",
       key: "actions",
       render: (text, record) => (
         <Space size="middle">
           <EditOutlined onClick={() => handleUpdate(record)} />
           <DeleteOutlined onClick={() => handleDelete(record.id)} />
         </Space>
       ),
    },
  ];

  return (
    <div className="user-manage-page">
        <div className="statistics-section">
                <Row className="statistics-box" justify="center" gutter={16}>
            <Col span={6}>
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
      <div className="search-section">
        <Input className="search-input"
          placeholder="Search by name or email"
          value={searchValue}
                    onChange={async event => {setSearchValue(event.target.value);}}
                    onPressEnter={handleSearch}
                    allowClear
       />
        <Button 
                        type="primary" 
                        className="search-button" 
                        onClick={handleSearch} 
                        loading={loading}>
                        Tìm kiếm
                    </Button>
        <Button
        className="add-user-btn"
            type="primary"
            onClick={() => handleAddUser()}
        >
            Add User
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
  
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
            const updatedUsers = users.map((user) =>
                user.id === currentUser.id ? { ...user, ...values } : user
            );
            setIsModalVisible(false);
            setUsers(updatedUsers);
            message.success("User updated successfully!");
            }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the user name!" }]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              <Select.Option value={0}>Admin</Select.Option>
              <Select.Option value={1}>Manager</Select.Option>
              <Select.Option value={2}>Staff</Select.Option>
            </Select>
          </Form.Item>
  
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input an address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input a phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
  
          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select a gender!" }]}
          >
            <Select placeholder="Select a gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
                    label="Reset Password"
                    name="resetPassword"
                    rules={[
                        { required: false, message: 'Please input the new password!' },
                    ]}
          >           
            <Input.Password placeholder="Enter a new password or leave blank to keep the current password" />
        </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )};