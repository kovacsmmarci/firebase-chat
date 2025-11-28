import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, onDisconnect, set } from 'firebase/database'
import { auth, rtdb } from './firebase'
import Auth from './components/Auth'
import ChatRoom from './components/ChatRoom'

export default function App(){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(u){
        setUser(u)
        const statusRef = ref(rtdb, `status/${u.uid}`)
        await set(statusRef, { online: true, displayName: u.displayName || u.email, lastSeen: Date.now() })
        onDisconnect(statusRef).set({ online: false, lastSeen: Date.now() })
      } else {
        setUser(null)
      }
    })
    return ()=>unsub()
  },[])

  return (
    <div className="app">
      <div className="header">
        <h1>Firebase Chat</h1>
        {user && <div>
          <span>{user.displayName || user.email}</span>
          <button onClick={()=>signOut(auth)} style={{marginLeft:8}} className="btn btn-primary">Sign out</button>
        </div>}
      </div>

      {user ? <ChatRoom user={user} /> : <Auth />}
    </div>
  )
}
