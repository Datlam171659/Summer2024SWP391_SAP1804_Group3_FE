import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import '../DashBoardPage/DashBoardPage.scss';
import { Space } from 'antd';
import { UserOutlined, ShoppingCartOutlined, ShoppingOutlined, DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import CustomerApi from '../../Services/api/CustomerApi';
import {getinvoiceAll} from '../../Services/api/InvoiceApi'
import {getProductAll} from '../../Services/api/productApi'
import userkApi from "../../Services/api/UserApi";
import DashBoardCard from './DashboardCard';
const DashBoardPage = () => {
  const [customerCount, setCustomerCount] = useState(0); 
  const [userCount, setUserCount] = useState(0); 
  const [invoiceCount, setInvoiceCount] = useState(0); 
  const [productCount, setProductCount] = useState(0); 
      const [data, setData] = useState([
        {date: "2022-01-01", value: 3000},
        {date: "2022-02-01", value: 3500},
        {date: "2022-03-01", value: 5000},
        {date: "2022-04-01", value: 4000},
      ]);

      const config = {
        data,
        xField: 'date',
        yField: 'value',
        seriesField: 'series',
        color: '#1970F1',
        width: 700, 
        height: 400, 
      };
      useEffect(() => {
        const fetchCustomerCount = async () => {
            try {
                const customers = await CustomerApi.getAllCustomers();
                
                if (Array.isArray(customers)) { 
                    setCustomerCount(customers.length); 
                }
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        }

        const fetchInvoiceCount = async () => {
          try {
            const response = await getinvoiceAll();
            if (response && Array.isArray(response.data)) {
              setInvoiceCount(response.data.length);
            }
          } catch (error) {
            console.error(`Error: ${error}`);
          }
        }

        const fetchProductCount = async () => {
          try {
            const response = await getProductAll();
            if (response && Array.isArray(response.data)) {
              setProductCount(response.data.length);
            }
          } catch (error) {
            console.error(`Error: ${error}`);
          }
        }

        const fetchUserCount = async () => {
          try {
            const response = await userkApi.getUserListApi();
               setUserCount(response.length);
              } catch (error) {
            console.error(`Error: ${error}`);
          }
        }

        fetchCustomerCount(); 
        fetchInvoiceCount();
        fetchProductCount();
        fetchUserCount();
      }, []);  

      return (
        <div className='dashboard-content'>
          <div className="overview">
            <Space direction='horizontal'>
              <DashBoardCard  icon={<UserOutlined style={{color: "red"}} />} title={"Customers"} value={customerCount}/>
              <DashBoardCard  icon={<TeamOutlined style={{color: "purple"}} />} title={"Users"} value={userCount}/>
              <DashBoardCard  icon={<ShoppingCartOutlined style={{color: "blue"}}/>} title={"Orders"} value={invoiceCount}/>
              <DashBoardCard  icon={<ShoppingOutlined style={{color: "brown"}}/>} title={"Inventory"} value={productCount}/>
              <DashBoardCard  icon={<DollarCircleOutlined style={{color: "green"}}/>} title={"Revenue"} value={4586}/>
            </Space>
          </div>
          <div className="line-chart-container">
            <Line {...config} />
          </div>
        </div>
      )
}

export default DashBoardPage