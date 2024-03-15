import React, { useState } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CreateEventButton from '../components/createEventButton';
import MyForm from "../components/eventModal";

const localizer = momentLocalizer(moment);

export const myEventsList: any[] = [];

function App() {
  const [showForm, setShowForm] = useState(false);

  return(
    <div className="App">
      <CreateEventButton forMethod={setShowForm}/>
      {showForm && <MyForm setShowForm={setShowForm} />}
      {showForm && <button type="button" onClick={() => setShowForm(false)}>X</button>}
      <Calendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 840, width: 1450 }}
      />
    </div>
  );
}

export default App;
