import React, { useState } from 'react';
import { BellFilled } from "@ant-design/icons";
import "./Header.scss";
import { Avatar, Switch } from "antd";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';

function Header() {
  const navigate = useNavigate();
  const uniqueName = localStorage.getItem('UniqueName');
  const initial = uniqueName ? uniqueName.charAt(0).toUpperCase() : '';
  const [showName, setShowName] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleShowName = () => {
    setShowName(!showName);
  };

  return (
    <header className={`header ${isDarkMode ? 'dark-mode' : 'bright-mode'}`}>
      <div className="logo" />
      <div className="body">
        <div className="user flex">  
          <div className="flex items-center">
            <p style={{ paddingRight: '25px'}}> Xin chào, {uniqueName}</p>
              {/* <button>
                <BellFilled className="mr-6 text-[18px] hover:text-gray-200" />
              </button> */}
            </div>
            <Switch
            checkedChildren="Tối"
            unCheckedChildren="Sáng"
            checked={isDarkMode}
            onChange={toggleTheme}
            style={{ marginRight: '10px' }}
          />
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
