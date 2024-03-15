import React, { useState } from 'react';
import { myEventsList } from '../routes/calendar';
import DatePicker from "react-datepicker";
import TimePicker from 'react-time-picker';

import "react-datepicker/dist/react-datepicker.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

interface FormProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

function MyForm({ setShowForm }: FormProps) {
  const [formData, setFormData] = useState({ title: '', start: '', end: '', description: '' });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<string>('10:00');
  const [endTime, setEndTime] = useState<string>('10:00');
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const changeStartTime= (timeValue: string) => {
    if (timeValue !== null)
    {
      setStartTime(timeValue);
    }
  };

  const handleSave = () => {
    if (startDate && endDate) {
      const startDateTime = new Date(startDate.toISOString().split('T')[0] + 'T' + startTime);
      const endDateTime = new Date(endDate.toISOString().split('T')[0] + 'T' + endTime);
      const newEvent = {start: startDateTime, end: endDateTime, title: formData.title, description: formData.description}
      myEventsList.push(newEvent);
      console.log(newEvent.description);
      setShowForm(false);
    }
  };

  return(
    <form>
      <label>
        Title:
        <input type="text" name="title" onChange={handleInputChange} />
        <br/>
      </label>
      <label>
        Start Date:
        <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)} />
        <TimePicker value={startTime} onChange={changeStartTime} />
        <br/>
      </label>
      <label>
        End Date:
        <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)} />
        <TimePicker value={endTime} onChange={setEndTime} />
        <br/>
      </label>
      <label>
        Description:
        <input type="text" name="description" onChange={handleInputChange} />
      </label>
      <button type="button" onClick={handleSave}>Save</button>
    </form>
  );
}

export default MyForm;
