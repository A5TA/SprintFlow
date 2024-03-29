import React, { useState } from 'react'
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const joinTeam = () => {
    const [teamName, setTeamName] = useState("");
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.target.value);
    }

    const createTeamReq = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        const token = localStorage.getItem('token');
    
        const config = {
          headers: { 
            Authorization: `Bearer ${token}`,
          }
        };
        
        Axios.post( 
          `http://localhost:8080/api/v1/team-controller/addUserToTeam/${teamName}`,
          {},
          config
        )
        .then((response) => {
          if(response.status === 200){
            console.log("You're good to go");
            navigate("/projects")
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
      }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createTeamReq(event);
    }

  return (
    <div>
        <h2>
            Join a team:
        </h2>

        <form onSubmit={handleSubmit}>
            <label>
                Enter team name you want to join:
            <input type='text' onChange={handleChange} value={teamName} ></input>
            </label>

        <button type='submit'>
          Join Team
        </button>
        </form>
    </div>
  )
}

export default joinTeam