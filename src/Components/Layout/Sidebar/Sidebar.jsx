import Sider from 'antd/es/layout/Sider';
import { useEffect, useState } from 'react';
import { decrypt } from '../../../Utils/crypto';
import "./Sidebar.scss"
import NavItem from './NavItem/NavItem';
import { CloseOutlined, MenuOutlined, SearchOutlined, DollarOutlined, AppstoreOutlined, InboxOutlined, LineChartOutlined, SettingOutlined, UserOutlined, PercentageOutlined, LogoutOutlined, ScheduleOutlined, CommentOutlined } from '@ant-design/icons';
import Search from 'antd/es/transfer/search';
import { strings_vi } from '../../../Services/languages/displaystrings';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const authToken = localStorage.getItem('token');
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      setRole(decodedToken.role);
    }
  }, []);


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
      ],
    },
    {
      icon: <AppstoreOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.Products,
      to: "/product",

    },
    {
      icon: <InboxOutlined style={{ fontSize: "16px" }} />,
      title: 'Đơn hàng',
      to: "/orders",

    },

    role === "0" || role === "1" ? {
      icon: <PercentageOutlined style={{ fontSize: "16px" }} />,
      title: 'Khuyến mãi',
      to: "/promotion",

    } :
      {
        display: "hidden"
      }
    ,
    role === "0" ? {
      icon: <SearchOutlined style={{ fontSize: "16px" }} />,
      title: strSidebar.SearchProfile,
      to: "/customer-search",

    } :
      {
        display: "hidden"
      },
    role === "0" ? {
      icon: <UserOutlined style={{ fontSize: "16px" }} />,
      title: 'Nhân sự',
      to: "/user",

    } :
      {
        display: "hidden"
      },
    {
      icon: <ScheduleOutlined style={{ fontSize: "16px" }} />,
      title: 'Quầy',
      to: "/station",
    },
    {
      icon: <CommentOutlined style={{ fontSize: "16px" }} />,
      title: 'Giao Tiếp',
      to: "/chat-room",
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
          display={item.display}
        />
      ))}
      <div className='text-black flex mt-[30%] mx-[5%] mb-[0] pt-[5px] pb-[5px] rounded-[5px] [transition:0.3] hover:bg-[rgb(246,_246,_246)]'>
        <p className="mr-3"><LogoutOutlined style={{ fontSize: "14px" }} /></p>
        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
      </div>
    </Sider>
  );
}

export default Sidebar;
