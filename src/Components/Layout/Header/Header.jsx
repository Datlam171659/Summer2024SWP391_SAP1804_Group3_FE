import "./Header.scss";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";


function Header() {
  const navigate = useNavigate();
  // const fullName = sessionStorage.getItem("fullName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo" />
      <div className="body">
        <di v className="user">
          <Avatar
            size={"large"}
            style={{
              color: "#2d3748",
              fontWeight: "bolder",
              backgroundColor: "#EDF2F7",
              verticalAlign: 'middle',
            }}
          >
            {/* {fullName?.length > 0 && fullName[0]} */}
          </Avatar>
          <div className="action">
            <p className="fullName">User Name</p>
          </div>
        </di>
      </div>
    </header>
  );
}

export default Header;
