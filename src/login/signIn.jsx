import React, { useState } from "react";
import "./loginForm.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from 'react-router-dom';
import { useUserContext } from '../authContext/authContext';

const SignIn = () => {
  const { setUser } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  async function usersLogin(email, password) {
    try {
      const userResponse = await fetch("http://localhost:3001/api/userLogin?email="+email+"&password="+password);
      if (!userResponse.ok) {
        window.alert('Datos erroneos, comprueba tus datos o puedes intentar creando un usuario');
        return false;
      } else {
        const userData = await userResponse.json();  
        if (userData.verified){
          const tokenResponse = await fetch(
          "http://localhost:3001/api/session", 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',},
            body: JSON.stringify({
              userID : userData._id,
              username : userData.username,
              admin : userData.admin
            }),
          });
        const token = await tokenResponse.json();
        
        setUser(token);

        return true;
        } else {
          return false;
        }
        
      }
    } catch (err) {
      alert(`Fallo en tiempo de respuesta`);
    };
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    const loginCheck = await usersLogin(email, password)

    if (loginCheck){
      console.log("Login successful");
      navigate("/mainPage")
    } else {
      window.alert('Unverified user');
    }  
  };

  const togglePassword = () => {
    setVisible(!visible);
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form">
      <form>
        <h2>Sign In</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className='password'>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='eye' onClick={togglePassword}>
          {visible ? (<EyeOutlined style={{color: "white" }} />) : (<EyeInvisibleOutlined style={{ color: "white" }} />)}
        </div>
        </div>
        <button  className="btn btn-secondary"  onClick={handleSignIn}>Sign In</button>
        <div className="link">
          <Link  className="text-white" to="/signUp">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;