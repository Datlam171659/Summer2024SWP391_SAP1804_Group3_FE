import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { decrypt } from '../../../Utils/crypto';
import "./Sidebar.scss"
import NavItem from './NavItem/NavItem';
import { CloseOutlined, MenuOutlined, SearchOutlined, DollarOutlined, AppstoreOutlined, InboxOutlined, LineChartOutlined, SettingOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  //   const encryptedRoleSyllabusValue = localStorage.getItem("RoleSyllabus");
  //   const decryptedRoleSyllabusValue = encryptedRoleSyllabusValue && decrypt(encryptedRoleSyllabusValue);

  const navItems = [
    {
      icon: <LineChartOutlined style={{ fontSize: "16px" }} />,
      title: 'Tổng quan',
      to: '/dashboard',
      children: [],
    },
    {
      icon: <DollarOutlined style={{ fontSize: "16px" }} />,
      title: 'Thanh toán',
      to: "",
      children: [
        {
          title: 'Mua',
          to: '/',
        },
        {
          title: 'Bán',
          to: '/sales-page',
        },
        // decryptedRoleSyllabusValue === "Full access" || decryptedRoleSyllabusValue === "Create" ? {
        //   title: 'Create syllabus',
        //   to: '',
        // } : {
        //   title: "",
        //   to: "",
        // },
      ],
    },
    {
      icon: <AppstoreOutlined style={{ fontSize: "16px" }} />,
      title: 'Sản phẩm',
      to: "",
      children: [],
    },
    {
      icon: <InboxOutlined style={{ fontSize: "16px" }} />,
      title: 'Đơn hàng',
      to: "",
      children: [],
    },
    // {
    //   icon: <UserOutlined style={{ fontSize: "16px" }} />,
    //   title: 'Client',
    //   to: "",
    //   children: [],
    // },
    {
      icon: <SearchOutlined style={{ fontSize: "16px" }} />,
      title: 'Search Profile',
      to: "/customer-search",  
      children: [],
    },
    {
      icon: <SettingOutlined style={{ fontSize: "16px" }} />,
      title: 'Cài đặt',
      to: "",
      children: [
        {
          title: 'Giá Vàng',
          to: '/exchange-rate',
        }
      ],
    },
  ];

  return (
    <Sider
      className='sidebar'
      collapsed={collapsed}
      theme='light'
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
      }}
    >
      <div
        className={collapsed ? 'close' : 'open'}
        onClick={() => {
          setCollapsed(!collapsed);
        }}
      >
        {collapsed ? <MenuOutlined /> : <CloseOutlined style={{ paddingRight: "10px" }} />}
      </div>
      {navItems.map((item) => (
        <NavItem
          key={item.title}
          icon={item.icon}
          title={item.title}
          to={item.to}
          children={item.children}
          collapsed={collapsed}
        />
      ))}
    </Sider>
  );
}

export default Sidebar;
