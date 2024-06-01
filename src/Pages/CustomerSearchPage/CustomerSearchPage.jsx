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
        const [form] = Form.useForm();
        const navigate = useNavigate();

        useEffect(() => {
            fetchCustomers();
        }, []); 
        
        const checkIfCustomerExists = (phone, email, id) => {
            let trimmedPhone = phone.trim();
            let trimmedEmail = email.trim();
            const phoneExists = allCustomers.find(customer => customer.phoneNumber === trimmedPhone && customer.id !== id);
            const emailExists = allCustomers.find(customer => customer.email === trimmedEmail && customer.id !== id);
            
            if(phoneExists){ 
              message.error("This phone number is already registered");
              return true;
            }
            if(emailExists){ 
              message.error("This email is already registered");
              return true;
            } 
            return false;
          }

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
            // console.log('Data from API: ', data);    
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
                form.setFieldsValue({
                customerName: record.customerName,
                address: record.address,
                gender: record.gender,
                phoneNumber: record.phoneNumber,
                email: record.email
                }); 
                setCurrentCustomer(record);
                setIsModalVisible(true);
            };

        const handleDelete = (customerId) => {
            Modal.confirm({
                title: 'Are you sure you want to delete this customer?',
                style: { top: '50%', transform: 'translateY(-50%)' },
                async onOk() {
                    try {
                        const customer = await CustomerApi.getCustomerByID(customerId); 
                        customer.status = 'inactive'; 
                        const updatedCustomer = await CustomerApi.updateCustomer(customerId, customer); 
                        message.success(`Customer ${updatedCustomer.customerName} set to inactive`);
                        fetchCustomers(); 
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
                        onPressEnter={handleSearch}
                        allowClear
                />
                        <Button 
                            type="primary" 
                            className="search-button" 
                            onClick={handleSearch} 
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
                        // pagination={{ pageSize: 15 }}
                        rowKey="id"           
                    />
                        <Modal title="Update Customer" 
                        open={isModalVisible} 
                        onCancel={() => {
                            setIsModalVisible(false) 
                        }}
                        footer={null}>

                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={{
                                customerName: currentCustomer.customerName,
                                address: currentCustomer.address,
                                gender: currentCustomer.gender,
                                phoneNumber: currentCustomer.phoneNumber,
                                email: currentCustomer.email
                            }}
                            onFinish={ async (values) => {
                                const trimmedEmail = values.email.trim();
                                const trimmedPhoneNumber = values.phoneNumber.trim();
                                if(checkIfCustomerExists(trimmedPhoneNumber, trimmedEmail, currentCustomer.id)){
                                    return;
                                }
                                try {
                                    const updatedValues = { ...values, phoneNumber: trimmedPhoneNumber, email: trimmedEmail, status: currentCustomer.status };
                                    await CustomerApi.updateCustomer(currentCustomer.id, updatedValues);
                                    message.success("Customer data updated successfully");
                                    fetchCustomers();
                                    setIsModalVisible(false);
                                    form.resetFields();
                                } catch (error) {
                                    message.error("Failed to update the customer data");
                                    return [];
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
                                rules={[{   required: true, message: 'Please input phone number!' },
                                        {
                                            pattern: new RegExp(/^\d{9,11}$/),
                                            message: "Phone number must be between 9 and 11 digits!",
                                        },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {   
                                        type: 'email',
                                        required: true, 
                                        message: 'The input is not valid E-mail!', 
                                    },
                                ]}
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