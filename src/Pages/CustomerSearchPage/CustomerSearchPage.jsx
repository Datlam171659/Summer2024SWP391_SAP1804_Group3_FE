import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Input, Table, Space, Button, Modal, message, Form, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./CustomerSearchPage.scss"
import CustomerApi from "../../Services/api/CustomerApi";
const CustomerSearchPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState({});

    const navigate = useNavigate();

        useEffect(() => {
        fetchCustomers();
    }, []); 

    const handleSearch = () => {
      if(searchValue === '')  {
        setCustomers(allCustomers);
      } else {
        const filteredCustomers = allCustomers.filter(customer => 
            customer.customerName.toLowerCase().includes(searchValue.toLowerCase()) || 
            customer.phoneNumber.includes(searchValue)
        );
        setCustomers(filteredCustomers);
    }
    };

    const fetchCustomers = async () => {
      setLoading(true);
      try {
          const data = await CustomerApi.getAllCustomers();
          const activeCustomers = data.filter(customer => customer.status === 'active');
          setAllCustomers(activeCustomers); 
          setCustomers(activeCustomers); 
      } catch(error) {
          console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const handleAddCustomer = () => {
        navigate('/customer-search/customer-add');
    }

    const handleUpdate = (record) => {
        // Update logic 
            // We are saving the record in the state
            setCurrentCustomer(record);
        
            // We are opening the modal
            setIsModalVisible(true);
        };

    const handleDelete = (customerId) => {
        Modal.confirm({
            title: 'Are you sure you want to set this customer to inactive?',
            style: { top: '50%', transform: 'translateY(-50%)' },
            async onOk() {
                try {
                    // console.log(customerId);
                    const updatedCustomer = await CustomerApi.updateCustomer(customerId, { status: 'inactive' });
                    message.success(`Customer ${updatedCustomer.id} set to inactive`);
                    fetchCustomers(); // Fetch the customers again so the list gets updated
                } catch (error) {
                    message.error(`Unable to set customer to inactive`);
                    console.log(error.message)
                }
            },
            onCancel() {
                
            },
        });
    }

    const columns = [
        {
            title: 'Customer Name',
            dataIndex: 'customerName'
        },
        {
            title: 'Address',
            dataIndex: 'address'
        },
        {
            title: 'Gender',
            dataIndex: 'gender'
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Points',
            dataIndex: 'points'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <EditOutlined onClick={() => handleUpdate(record)} />
                    <DeleteOutlined onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <div className="customer-search">
            <div className="search-section">
                <Input className="search-input" 
                    placeholder="Search customer by name and phone number" 
                    value={searchValue}
                    onChange={async event => {setSearchValue(event.target.value);
                                                if(event.target.value === '') {
                                                await fetchCustomers('')
                                            }
                                            }}
                    allowClear
               />
                    <Button 
                        type="primary" 
                        className="search-button" 
                        htmlType="submit"
                        loading={loading}>
                        Search
                    </Button>
                    <Button type="primary" 
                        className="add-customer-button"
                        onClick={handleAddCustomer}
                        >Add Customer
                    </Button>
            </div>
                <Table
                    columns={columns}
                    dataSource={customers}
                    loading={loading}
                    rowKey="id"
                />
                    <Modal title="Update Customer" 
                    open={isModalVisible} 
                    onCancel={() => setIsModalVisible(false)} 
                    footer={null}>

                    <Form
                        layout="vertical"
                        initialValues={{
                            customerName: currentCustomer.customerName,
                            address: currentCustomer.address,
                            gender: currentCustomer.gender,
                            phoneNumber: currentCustomer.phoneNumber,
                            email: currentCustomer.email
                        }}
                        onFinish={ async (values) => {
                            try {
                                await CustomerApi.updateCustomer(currentCustomer.id, values);
                                message.success("Customer data updated successfully");
                                fetchCustomers();
                                setIsModalVisible(false);
                            } catch (error) {
                                message.error("Failed to update the customer data");
                            }
                        }}
                    >
                        <Form.Item
                            label="Customer Name"
                            name="customerName"
                            rules={[{ required: true, message: 'Please input customer name!' }]}
                        >
                <Input />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input address!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Gender"
                            name="gender"
                            rules={[{ required: true, message: 'Please select gender!' }]}
                        >
                            <Select>
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            name="phoneNumber"
                            rules={[{ required: true, message: 'Please input phone number!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input email!', type: "email" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" block htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
            </Modal>
        </div>  
    )
}

export default CustomerSearchPage;