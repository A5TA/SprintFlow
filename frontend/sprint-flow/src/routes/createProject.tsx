
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import Select from 'react-select';
import 'react-select-search/style.css'


const CreateProject = () => {
  const [teamName, setTeamName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [projectName, setProjectName] = useState("");
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [data, setData] = useState<string[]>([]);

  const teamNameChange = (event: any) => {
    setTeamName(event.target.value);
  }

  const projectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  }

  // Fetch team data from API
  const fetchTeams = async () => {
    try {
      const response = await Axios.get('http://localhost:8080/api/v1/team-controller/getAllTeamsForUser', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);
  
  const createReq = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
      }
    };

    // Convert startDate and endDate to Java Date objects
    const javaStartDate = startDate ? new Date(startDate.getTime()) : null;
    const javaEndDate = endDate ? new Date(endDate.getTime()) : null;

    const bodyParameters = {
      "name": projectName,
      "startDate": javaStartDate, // Java Date object
      "endDate": javaEndDate, // Java Date object
      "teamName": teamName
    };
    
    Axios.post( 
      'http://localhost:8080/api/v1/project-controller/createProject',
      bodyParameters,
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

  const handleSaveAndSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createReq(event);
  }

  const options = data.map((element) => ({
    label: element,
    value: element,
  }));
  

  return (
    <div>
        <form onSubmit={handleSaveAndSend}>
        <Select onChange={(choice: any) => setTeamName(choice.value)} options={options} placeholder="Choose Your Team"/>
        <br/>
        <label>
          Start Date:
          <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
        </label>
        <br/>
        <label>
          End Date:
          <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} />
        </label>
        <br/>
        <label>
          Project Name:
          <input type='text' onChange={projectChange} value={[projectName]}/>
        </label>
        <br/>
        <button type='submit'>
          Create Project
        </button>
      </form>
    </div>
  )
}

export default CreateProject