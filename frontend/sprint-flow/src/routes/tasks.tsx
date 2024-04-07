import { useState } from "react";
import Axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CTasks() {
    const [description, setDescription] = useState("");
    const [projectName, setProjectName] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [taskName, setTaskName] = useState("");
    const [points, setPoints] = useState("");

    const handleDescription = (event: any) => {
        setDescription(event.target.value);
    }
    const handleProjectName = (event: any) => {
        setProjectName(event.target.value);
    }
    const handleTaskName = (event: any) => {
        setTaskName(event.target.value);
    }
    const handlePoints = (event: any) => {
        setPoints(event.target.value);
    }

    const sendReq = (event: any) => {
        event.preventDefault();
        const token = localStorage.getItem('token'); 
        const javaStartDate = dueDate ? new Date(dueDate.getTime()) : null;
        const javaDueDate = dueDate ? new Date(dueDate.getTime()) : null;
        const pointsInt = parseInt(points, 10);

        const bodyParameters = {
            "name": taskName,
            "desc": description,
            "startDate": javaStartDate,
            "dueDate": javaDueDate,
            "points": pointsInt,
            "projectName": projectName,
          };

          const config = {
            headers: { 
              Authorization: `Bearer ${token}`,
            }
          };
        
        Axios.post( 
          'http://localhost:8080/api/v1/tasks-controller/createTaskForProject',
          bodyParameters,
          config
        )
        .then((response) => {
            if (response.status === 200){
                console.log("Your good to go!")
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
          Task Name:
          <input onChange={handleTaskName} value={taskName} type='text'/>
        </label>
        <br/>
        <label>
         Description:
          <input onChange={handleDescription} value={description} type='text'/>
        </label>
        <br/>
        <label>
          Start Date:
          <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
        </label>
        <br/>
        <label>
          End Date:
          <DatePicker selected={dueDate} onChange={(date: Date | null) => setDueDate(date)} />
        </label>
        <br/>
        <label>
          Points:
          <input onChange={handlePoints} value={points} type='text'/>
        </label>
        <br/>
        <label>
          Project Name:
          <input onChange={handleProjectName} value={projectName} type='text'/>
        </label>
        <br/>
        <button type='submit'>
          Create Task
        </button>
        </form>  
    </div>
    );

}