import React, { useState } from 'react';
import { BellFilled } from "@ant-design/icons";
import "./Header.scss";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const uniqueName = localStorage.getItem('UniqueName');
  const initial = uniqueName ? uniqueName.charAt(0).toUpperCase() : '';
  const [showName, setShowName] = useState(false);

  const toggleShowName = () => {
    setShowName(!showName);
  };

  return (
    <header className="header">
      <div className="logo" />
      <div className="body">
        <div className="user flex">
          <div className="flex items-center">
            <button>
              <BellFilled className="mr-6 text-[18px] hover:text-gray-200" />
            </button>
          </div>

          <div className="relative">
            <Avatar
              size={"large"}
              style={{
                color: "#2d3748",
                fontWeight: "bolder",
                backgroundColor: "#EDF2F7",
                verticalAlign: 'middle',
                display: "flex",
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={toggleShowName}
            >
              {initial}
            </Avatar>
            {showName && (
              <div className="absolute right-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg whitespace-nowrap">
                <p className="text-[small] text-gray-700 font-semibold">{uniqueName}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
