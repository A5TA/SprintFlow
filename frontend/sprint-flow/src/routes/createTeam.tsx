import Axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function CTeam() {
  const [name, setName] = useState("");

  // useEffect hook to log the name when it changes
  useEffect(() => {
    console.log(name);
  }, [name]);

  const onChange = (event: any) => {
    setName(event.target.value);
  }

  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0aW5nMUBnbWFpbC5jb20iLCJpYXQiOjE3MTA0NDMyMzcsImV4cCI6MTcxMDQ0NDY3N30.pg4902Msef8n8B01Y8UpR8xzHKKwJwxUIuGwHhG-wkQ"; // Replace with your actual token

  const sendReq = (event: any) => {
    event.preventDefault(); 

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
