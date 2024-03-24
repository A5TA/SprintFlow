import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

export default function Login() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();


    const handlePassword = (event: any) => {
        setPassword(event.target.value);
    }
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
    }
    const sendReq = (event: any) => {
      event.preventDefault(); 

      const bodyParameters = {
          "email": email,
          "password": password,
        };
      
      Axios.post( 
        'http://localhost:8080/api/v1/auth/login',
        bodyParameters
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200){
          navigate("/main");
        }
      })
    }
  
    return (
    <div>
        <form>
        <label>
          Email:
          <input onChange={handleEmail} value={email} type='text'/>
        </label>
        <br/>
        <label>
          Password:
          <input onChange={handlePassword} value={password} type='text'/>
        </label>
        <br/>
        <button type='submit' onClick={sendReq}>
          Sign In
        </button>
        <Link to="/register">
        <button type='button' onClick={() => console.log("")}>
          Register
        </button>
        </Link>
        </form>  
    </div>
    );
}