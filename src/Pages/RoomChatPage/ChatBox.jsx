//ChatBox.jsx

import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from '../firebase/ChatRoomFirebase'

const ChatBox = () => {
  const messagesEndRef = useRef();
  const [messages, setMessages] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  };

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limit(50),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const filteredMessages = [];
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        if (message.type === "message") {
          filteredMessages.push({ ...doc.data(), id: doc.id });
        }
      });
      setMessages(filteredMessages)
    });

    return () => unsubscribe;
  }, []);

  return (

    <div className="flex flex-col h-[calc(100vh-8rem)] border border-gray-300 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
};

export default ChatBox;
