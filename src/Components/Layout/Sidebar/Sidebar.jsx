import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { decrypt } from '../../../Utils/crypto';
import "./Sidebar.scss"
import NavItem from './NavItem/NavItem';
import { AreaChartOutlined, CloseOutlined, DropboxOutlined, MenuOutlined, PayCircleFilled, ProductFilled, SettingFilled, UserOutlined, SearchOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  //   const encryptedRoleSyllabusValue = localStorage.getItem("RoleSyllabus");
  //   const decryptedRoleSyllabusValue = encryptedRoleSyllabusValue && decrypt(encryptedRoleSyllabusValue);

  const navItems = [
    {
      icon: <AreaChartOutlined style={{ fontSize: "20px" }} />,
      title: 'Dashboard',
      to: '/',
      children: [],
    },
    {
      icon: <PayCircleFilled style={{ fontSize: "20px" }} />,
      title: 'Bill',
      to: "",
      children: [
        {
          title: 'Buy',
          to: '/',
        },
        {
          title: 'Sell',
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
      icon: <ProductFilled style={{ fontSize: "20px" }} />,
      title: 'Inventory',
      to: "",
      children: [],
    },
    {
      icon: <DropboxOutlined style={{ fontSize: "20px" }} />,
      title: 'Order',
      to: "",
      children: [],
    },
    // {
    //   icon: <UserOutlined style={{ fontSize: "20px" }} />,
    //   title: 'Client',
    //   to: "",
    //   children: [],
    // },
    {
      icon: <SearchOutlined style={{ fontSize: "20px" }} />,
      title: 'Search Profile',
      to: "/customer-search",  
      children: [],
    },
    {
      icon: <SettingFilled style={{ fontSize: "20px" }} />,
      title: 'Setting',
      to: "",
      children: [
        {
          title: 'Log out',
          to: '/',
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
