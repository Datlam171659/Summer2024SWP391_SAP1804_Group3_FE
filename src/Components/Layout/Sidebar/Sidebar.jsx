import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { decrypt } from '../../../Utils/crypto';
import "./Sidebar.scss"
import NavItem from './NavItem/NavItem';
import { CloseOutlined, MenuOutlined, SearchOutlined, DollarOutlined, AppstoreOutlined, InboxOutlined, LineChartOutlined, SettingOutlined, UserOutlined, PercentageOutlined, LogoutOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';
import { strings_vi } from '../../../Services/languages/displaystrings';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  //   const encryptedRoleSyllabusValue = localStorage.getItem("RoleSyllabus");
  //   const decryptedRoleSyllabusValue = encryptedRoleSyllabusValue && decrypt(encryptedRoleSyllabusValue);
  const strSidebar = strings_vi.SideBar;
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
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
          to: '/buy-back-page',
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
      to: "/product",
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
      to: "/user",
      children: [],
    },
    {
      icon: <PercentageOutlined style={{ fontSize: "16px" }} />,
      title: 'Khuyến mãi',
      to: "/promotion",
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
      id='sidebar'
      className='sidebar'
      collapsed={collapsed}
      theme='light'
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        borderLeft: "2px solid black"
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
      <div className='flex mt-[30%] mx-[5%] mb-[0] pt-[5px] pb-[5px] rounded-[5px] [transition:0.3] hover:bg-[rgb(246,_246,_246)]'>
        <p className="mr-3"><LogoutOutlined style={{ fontSize: "14px" }} /></p>
        <button className="" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </Sider>
  );
}

export default Sidebar;
