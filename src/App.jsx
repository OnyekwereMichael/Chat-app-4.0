import { Route, Routes, useNavigate } from "react-router-dom"
import Chat from './pages/Chat/Chat'
import Profile from './pages/Profile/Profile'
import Login from './pages/Login/login'
import EnterChat from './component/EnterChat/Enterchat'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/Firebase";
import { AppContext } from "./context/Context";
function App() {
  const navigate = useNavigate()
   const {loadUserData} = useContext(AppContext);

  useEffect(() => {
  onAuthStateChanged(auth, async (user) => {
    if(user) {
     navigate('/chat')
      await loadUserData(user.uid)
    }else{
      navigate('/')
    }
  })
  },[])
  return (
    <>
      <ToastContainer />
      <Routes>
         <Route path="/" element={<Login />}></Route>
         <Route path="/chat" element={<Chat />}></Route>
         <Route path="/profile" element={<Profile />}></Route>
         <Route path="/Enterchat" element={<EnterChat />}></Route>
      </Routes>
    </>
  )
}

export default App
