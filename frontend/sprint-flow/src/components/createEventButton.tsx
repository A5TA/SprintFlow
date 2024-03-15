import React from 'react';
import { useContext } from 'react';
import plus from '../assets/plus.png';

interface CreateEventButtonProps {
  forMethod: React.Dispatch<React.SetStateAction<boolean>>;
}

// This component renders the create button, where it can call a function onClick.
// In this case when using it in App.jsx, it sets showEventModal to true, which shows the form
// of creating an event.
export default function CreateEventButton({ forMethod }: CreateEventButtonProps) {
  return (
    <button onClick={() => forMethod(true)} style={{ width: '80px', height: '30px' }}>
      <span>Create</span>
      <img src={plus} alt="create_event" style={{ width: '20px', height: '20px' }} />
    </button>
  );
}
