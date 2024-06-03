import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { decrypt } from '../../../Utils/crypto';
import "./Sidebar.scss"
import NavItem from './NavItem/NavItem';
import { CloseOutlined, MenuOutlined, SearchOutlined, DollarOutlined, AppstoreOutlined, InboxOutlined, LineChartOutlined, SettingOutlined, UserOutlined, PercentageOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';
import { strings_vi } from '../../../Services/languages/displaystrings';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  //   const encryptedRoleSyllabusValue = localStorage.getItem("RoleSyllabus");
  //   const decryptedRoleSyllabusValue = encryptedRoleSyllabusValue && decrypt(encryptedRoleSyllabusValue);
  const strSidebar = strings_vi.SideBar;
  const navItems = [
    {
      icon: <LineChartOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Overview,
      to: '/dashboard',
      children: [],
    },
    {
      icon: <DollarOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Payment,
      to: "",
      children: [
        {
          title: strSidebar.Buy,
          to: '/',
        },
        {
          title: strSidebar.Sell,
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
      title: strSidebar.Products,
      to:"/product",
      children: [],
    },
    {
      icon: <InboxOutlined style={{ fontSize: "16px" }} />,
      title: 'Đơn hàng',
      to: "",
      children: [],
    },
    {
      icon: <UserOutlined style={{ fontSize: "16px" }} />,
      title: 'Nhân sự',
      to: "",
      children: [],
    },
    {
      icon: <PercentageOutlined style={{ fontSize: "16px" }} />,
      title: 'Khuyến mãi',
      to: "",
      children: [],
    },
    {
      icon: <SearchOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.SearchProfile,
      to: "/customer-search",
      children: [],
    },
    {
      icon: <SettingOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Setting,
      to: "",
      children: [
        {
          title: strSidebar.GoldPrice,
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
