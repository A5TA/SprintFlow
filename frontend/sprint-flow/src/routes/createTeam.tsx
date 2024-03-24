import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CTeam() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  
  const onChange = (event: any) => {
    setName(event.target.value);
  }

  

  const sendReq = (event: any) => {
    event.preventDefault(); 
    const token = localStorage.getItem('token');

    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
      }
    };

    const bodyParameters = {
      "name": name
    };
    
    Axios.post( 
      'http://localhost:8080/api/v1/team-controller/createTeamFromUser',
      bodyParameters,
      config
    )
    .then((response) => {
      if(response.status === 200){
        console.log("your good to go");
        navigate("/projects");
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  }

  return (
    <div>
      <form onSubmit={sendReq}>
        <label>
          Enter the name of your team:
          <input type='text' onChange={onChange} value={name}/>
        </label>
        <button type='submit'>
          Create Team
        </button>
      </form>
    </div>
  );
}
