import { LogoutOutlined } from "@ant-design/icons";
import "./Header.scss";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('UserName');
  const initial = userName ? userName.charAt(0).toUpperCase() : '';

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo" />
      <div className="body">
        <div className="user flex" >
          <div className="action w-auto flex items-center" >
            <div className="w-full flex items-center transition-all hover:text-gray-200" style={{ fontSize: "16px", fontWeight: "400" }}>
              <p className="mr-3"><LogoutOutlined style={{ fontSize: "14px" }} /></p>
              <button className="" onClick={handleLogout}>Đăng xuất</button>
            </div>

            {/* <p className="fullName">User Name</p> */}
          </div>
          <Avatar
            size={"large"}
            style={{
              color: "#2d3748",
              fontWeight: "bolder",
              backgroundColor: "#EDF2F7",
              verticalAlign: 'middle',
            }}
          >
            {initial}
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export default Header;
