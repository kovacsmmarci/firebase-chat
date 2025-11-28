import React, { useEffect, useRef, useState } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import dayjs from 'dayjs'

export default function MessageList({ roomId, currentUser }){
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  useEffect(()=>{
    const q = query(collection(db, `rooms/${roomId}/messages`), orderBy('createdAt'))
    const unsub = onSnapshot(q, snap=>{
      const msgs = snap.docs.map(d=>({ id: d.id, ...d.data() }))
      setMessages(msgs)
      setTimeout(()=>bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    })
    return ()=>unsub()
  },[roomId])

  return (
    <div className="messages">
      {messages.map(m=> (
        <div key={m.id} className={`message ${m.senderId === currentUser.uid ? 'self' : 'other'}`}>
          <div><strong>{m.senderName || 'Anon'}</strong> <small>{m.createdAt?.toDate ? dayjs(m.createdAt.toDate()).format('HH:mm') : ''}</small></div>
          <div>{m.text}</div>
          {m.imageUrl && <img src={m.imageUrl} style={{maxWidth:200, display:'block', marginTop:8}} />}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
