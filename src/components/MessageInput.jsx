import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function MessageInput({ roomId, currentUser }){
  const [text, setText] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    await addDoc(collection(db, `rooms/${roomId}/messages`), {
      text: text.trim(),
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email,
      createdAt: serverTimestamp()
    });

    setText('');
  };

  return (
    <form onSubmit={sendMessage} className="input-area" aria-label="Send message">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message"
        className="input"
        style={{flex:1}}
      />
      <button type="submit" className="btn btn-primary">Send</button>
    </form>
  );
}
