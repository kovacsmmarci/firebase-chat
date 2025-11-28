import React from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatRoom({ user }){
  const roomId = 'general'
  return (
    <div>
      <h2>General Room</h2>
      <MessageList roomId={roomId} currentUser={user} />
      <MessageInput roomId={roomId} currentUser={user} />
    </div>
  )
}
