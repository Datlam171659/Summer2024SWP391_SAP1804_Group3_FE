import { BellFilled } from "@ant-design/icons";
import "./Header.scss";
import { Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('UserName');
  const initial = userName ? userName.charAt(0).toUpperCase() : '';

  return (
    <header className="header">
      <div className="logo" />
      <div className="body">
        <div className="user flex" >
          <div className="flex items-center">
            <button>
              <BellFilled className="mr-12 text-[18px] hover:text-gray-200" />
            </button>

          </div>

          <Avatar
            size={"large"}
            style={{
              color: "#2d3748",
              fontWeight: "bolder",
              backgroundColor: "#EDF2F7",
              verticalAlign: 'middle',
              display: "flex",
              alignItems: "center"
            }}
          >
            {initial}
          </Avatar>
          <div className="action w-12 flex items-center ml-4" >
            <p className="p-[4px] text-[small] font-semibold text-right">{userName}</p>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;
