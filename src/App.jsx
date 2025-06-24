import React, { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import {Routes, Route, useLocation, useNavigate} from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer, toast } from 'react-toastify';
import netflix_spinner from './assets/netflix_spinner.gif';
// import 'react-toastify/dist/ReactToastify.css';
const App = () => {

   const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);

      // Only redirect if they are on login page and already signed in
      if (user && location.pathname === '/login') {
        navigate('/');
      }

      // Only redirect if not logged in and trying to access a protected route
      if (!user && location.pathname !== '/login') {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="login-spinner">
        <img src={netflix_spinner} alt="Loading..." />
      </div>
    );
  }


  // const navigate = useNavigate();

  // useEffect(()=>{
  //   onAuthStateChanged(auth, async (user)=>{
  //     if(user){
  //       console.log("Logged In");
  //       navigate('/');
  //     }else {
  //       console.log("Logged Out");
  //       navigate('/login');
  //     }
  //   })
  // },[])
  
   
  return (
    <div>
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home/> : <Login/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/player/:id' element={isAuthenticated ? <Player/> : <Login/>}/>
      </Routes>
      
    </div>
  )
}

export default App
