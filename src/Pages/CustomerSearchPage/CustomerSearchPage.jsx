import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Input, Table, Space, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./CustomerSearchPage.scss"
import CustomerApi from "../../Services/api/CustomerApi";
import AddCustomerPage from "../AddCustomer/AddCustomerPage";

const CustomerSearchPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [allCustomers, setAllCustomers] = useState([]);
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
          setAllCustomers(data); 
          setCustomers(data); 
      } catch(error) {
          console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const handleAddCustomer = () => {
        navigate('/customer-search/customer-add');
    }

    const handleUpdate = (customerId) => {
        // Update logic here
    }

    const handleDelete = (customerId) => {
        // Delete logic here
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
                    <EditOutlined onClick={() => handleUpdate(record.id)} />
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
                                        if(event.target.value === ''){
                                           await fetchCustomers('')
                                          }
               }}
               allowClear
               />
        <Button type="primary" 
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
                rowKey="id"
            />
        </div>
    )
}

export default CustomerSearchPage;