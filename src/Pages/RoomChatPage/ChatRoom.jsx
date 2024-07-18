import React from 'react'
import ChatBox from './ChatBox'
import SendMessage from './SendMessage'

const ChatRoom = () => {
  return (
    <div className='w-3/4'>
        <ChatBox/>
        <SendMessage/>
    </div>
  )
}

export default ChatRoom