import { useState } from "react";
import Axios from 'axios';

export default function Register() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");

    const handlePassword = (event: any) => {
        setPassword(event.target.value);
    }
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
    }
    const handleFName = (event: any) => {
        setFName(event.target.value);
    }
    const handleLName = (event: any) => {
        setLName(event.target.value);
    }

    const sendReq = (event: any) => {
        event.preventDefault(); 

        const bodyParameters = {
            "firstName": fName,
            "lastName": lName,
            "email": email,
            "password": password,
          };
        
        Axios.post( 
          'http://localhost:8080/api/v1/auth/register',
          bodyParameters
        )
        .then((response) => {
          const token = response.data.token;
          localStorage.setItem('token', token);
          console.log(localStorage);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
      }
    

    return (
        <div>
        <form onSubmit={sendReq}>
        <label>
          First Name:
          <input onChange={handleFName} value={fName} type='text'/>
        </label>
        <br/>
        <label>
          Last Name:
          <input onChange={handleLName} value={lName} type='text'/>
        </label>
        <br/>
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
        <button type='submit'>
          Sign Up
        </button>
        </form>  
    </div>
    );

}