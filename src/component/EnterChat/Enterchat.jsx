import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Enterchat() {
    const navigate = useNavigate()
    const [room, Setroom] = useState(null)
    const roomInputName= useRef(null)
  return (
    <div>
        {room ? 
        navigate('/chat')
        :
        <div>
            <input type="text" ref={roomInputName}/>
            <p>Enter a room</p>
            <button onClick={() => Setroom(roomInputName.current.value)}>Enter Chat</button>
        </div>
    }
       
    </div>
  )
}

export default Enterchat
