import React from "react";
import { format } from "date-fns"; 
import { vi } from 'date-fns/locale';

const Message = ({ message }) => {  
  const uniqueName = localStorage.getItem('UniqueName');  
  const messagePosition = message.name === uniqueName ? "chat-end" : "chat-start";
  const formattedDate = message.createdAt ? format(message.createdAt.toDate(), "dd/MM/yyyy HH:mm", { locale: vi }) : '';

  return (
    <div className="w-3/4">
      <div className={`chat ${messagePosition} pl-40 ml-10`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img src={`${process.env.PUBLIC_URL}/avt-dang-iu.jpg`} alt="My Image"/> 
          </div>
        </div>
        <div className="chat-header text-red-500 font-bold">
          {message.name}
        </div>
        <div className="chat-bubble bg-white text-black">{message.text}</div>
        <div className="text-gray-500 mt-2 text-xs">{formattedDate}</div> 
      </div>
    </div>
  );
};

export default Message;
