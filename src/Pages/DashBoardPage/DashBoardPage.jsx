import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import '../DashBoardPage/DashBoardPage.scss';
import { Card, Space, Table } from 'antd';
import { UserOutlined, ShoppingCartOutlined, ShoppingOutlined, DollarCircleOutlined, TeamOutlined } from '@ant-design/icons';
import CustomerApi from '../../Services/api/CustomerApi';
import {getinvoiceAll, GetMonthlyRevenue} from '../../Services/api/InvoiceApi'
import {getProductAll} from '../../Services/api/productApi'
import userkApi from "../../Services/api/UserApi";
import DashBoardCard from './DashboardCard';
import Title from 'antd/es/skeleton/Title';
const DashBoardPage = () => {
  const [customerCount, setCustomerCount] = useState(0); 
  const [userCount, setUserCount] = useState(0); 
  const [invoiceCount, setInvoiceCount] = useState(0); 
  const [productCount, setProductCount] = useState(0); 
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0); 
  const [topCustomers, setTopCustomers] = useState([]);
  const [topStaff, setTopStaff] = useState([]);


      useEffect(() => {
        const fetchCustomerCount = async () => {
            try {
                const customers = await CustomerApi.getAllCustomers();             
                if (Array.isArray(customers)) { 
                    setCustomerCount(customers.length); 
                    const invoices = await getinvoiceAll();
                    if(invoices && Array.isArray(invoices.data)) {
                      const customersWithOrders = customers.map(customer => ({
                        ...customer,
                        orderCount: invoices.data.filter(invoice => invoice.customerId === customer.id).length
                      }));
                      const topCustomers = customersWithOrders.sort((a, b) => b.orderCount - a.orderCount).slice(0, 3);
                      setTopCustomers(topCustomers);
                    }
                  }
            } catch (error) {
                console.error(`Error: ${error}`);
            }
        }
        

        const fetchUserCount = async () => {
          try {
            const response = await userkApi.getUserListApi();
            if (Array.isArray(response)) {
              setUserCount(response.length);
              const invoices = await getinvoiceAll();
              if (invoices && Array.isArray(invoices.data)) {
                const staffWithInvoices = response.map(staff => ({
                  ...staff,
                  invoiceCount: invoices.data.filter(invoice => invoice.staffId === staff.staffId).length
                }));
                const topStaff = staffWithInvoices.sort((a, b) => b.invoiceCount - a.invoiceCount).slice(0, 3);
                setTopStaff(topStaff);
              }
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

        const fetchMonthlyRevenue = async () => {
          try {
            const response = await GetMonthlyRevenue();
            console.log(response);
            if (response) {
              const formattedData = response.data.map(item => ({
                date: item.key,
                value: item.value 
              }));
        
              setMonthlyRevenue(formattedData);
    
              const total = formattedData.reduce((sum, record) => sum + record.value, 0);
              setTotalRevenue(total);
            }
          } catch (error) {
            console.error(`Error: ${error}`);
          }
        };

        fetchCustomerCount(); 
        fetchInvoiceCount();
        fetchProductCount();
        fetchUserCount();
        fetchMonthlyRevenue();
      }, []);  
      
      const formatRevenue = (value) => {
        return new Intl.NumberFormat().format(value) + ' VNĐ';
      };

      const config = {
        data: monthlyRevenue,
        xField: 'date',
        yField: 'value',
        seriesField: 'series',
        color: '#1970F1',
        width: 700,
        height: 400,
        point: {
          size: 5,
          shape: 'diamond',
        },
        label: {
          style: {
            fill: '#aaa',
          },
        },
        tooltip: {
          showMarkers: true,
        },
      };

      const customerColumns  = [
        {
          title: 'Tên khách hàng',
          dataIndex: 'customerName',
          key: 'customerName',
        },
        {
          title: 'Tổng đơn hàng',
          dataIndex: 'orderCount',
          key: 'orderCount',
        },
      ];

      const staffColumns = [
        {
          title: 'Tên nhân viên',
          dataIndex: 'fullName',
          key: 'fullName',
        },
        {
          title: 'Tổng số đơn bán được',
          dataIndex: 'invoiceCount',
          key: 'invoiceCount',
        },
      ];
    
      return (
        <div className='dashboard-content'>
          <div className="overview">
            <Space direction='horizontal'>
              <DashBoardCard icon={<UserOutlined style={{color: "red"}} />} title={"Khách Hàng"} value={customerCount}/>
              <DashBoardCard icon={<TeamOutlined style={{color: "purple"}} />} title={"Nhân Viên"} value={userCount}/>
              <DashBoardCard icon={<ShoppingCartOutlined style={{color: "blue"}}/>} title={"Đơn Hàng Đã Bán"} value={invoiceCount}/>
              <DashBoardCard icon={<ShoppingOutlined style={{color: "brown"}}/>} title={"Số Mặt Hàng"} value={productCount}/>
              <DashBoardCard icon={<DollarCircleOutlined style={{color: "green"}}/>} title={"Tổng Doanh Thu"} value={formatRevenue(totalRevenue)} />
            </Space>
          </div>
          <div className='main-content'>
            <div className='left-content'>
              <div className="line-chart-container">
                <Card title="Doanh số bán hàng theo tháng" style={{width:'100%'}}>
                <Line {...config} />
                </Card>
              </div>
            </div>
          <div className='right-content'>
              <div className="top-customers">
                  <Card title="Top 3 khách hàng có nhiều đơn hàng nhất:" className="card-top-customers">
                    <Table columns={customerColumns} dataSource={topCustomers} rowKey="id" pagination={false} />
                  </Card>
              </div>
              <div className="top-staff">
                  <Card title="Top 3 nhân viên bán được nhiều nhất trong tháng:" className="card-top-staff">
                    <Table columns={staffColumns} dataSource={topStaff} rowKey="id" pagination={false} />
                  </Card>
              </div>
            </div>
          </div>
        </div>
      )
}

export default DashBoardPage