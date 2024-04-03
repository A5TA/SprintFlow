import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const joinTeam = () => {
    const [teamName, setTeamName] = useState("");
    const navigate = useNavigate();
    const [allTeams, setAllTeams] = useState<string[]>([]);
    const [userTeams, setUserTeams] = useState<string[]>([]);

    const token = localStorage.getItem('token');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(event.target.value);
    }

    const fetchAllTeams = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeams', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAllTeams(response.data.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const fetchUserTeams = async () => {
      try {
        const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeamsForUser', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserTeams(response.data.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const options = allTeams.filter(team => !userTeams.includes(team)).map((element) => ({
      label: element,
      value: element,
    }));

    useEffect(() => {
      fetchAllTeams();
      fetchUserTeams();
    }, []);

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
        <Select onChange={(choice: any) => setTeamName(choice.value)} options={options} placeholder="Choose Your Team"/>
        <button type='submit'>
          Join Team
        </button>
        </form>
    </div>
  )
}

export default joinTeam