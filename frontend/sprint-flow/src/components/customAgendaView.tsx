import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Colors, getColorById } from '../services/apiServices';

function CustomAgenda({
  accessors,
  components,
  date,
  events,
  getters,
  length,
  localizer,
  ...props
}) {
  
  // Refs for DOM elements
  const headerRef = useRef(null);
  const tbodyRef = useRef(null);

  // Adjust header width and handle overflow
  useEffect(() => {
    // Adjust header width and handle overflow
    const _adjustHeader = () => {
      if (!tbodyRef.current) return;

      const header = headerRef.current;
      const firstRow = tbodyRef.current.firstChild;

      if (!firstRow) return;

      // Implementation for adjusting header width
      // ...
    };

    // Call _adjustHeader function
    _adjustHeader();
  }, [date, length, localizer, events]);

  // Rendering function for each day's events

  // Time range label function

  function formatDate(dateString: string) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options).replace(/(\d+)(st|nd|rd|th)/, '$1<sup>$2</sup>');
}

  // Rendering
  return (
    events.length !== 0 ? 
      <div className="custom-agenda-view">
        <center>
        <h1 style={{color: "#8400be"}}> Agenda </h1>
        </center>
        <table className="rbc-agenda-table">
          <thead>
            <tr>
              <th className="custom-header" ref={headerRef}>
                {/* Header content */}
              </th>
            </tr>
          </thead>
        </table>
  
        {/* Render table content */}
        <div className="rbc-agenda-content" ref={tbodyRef}>
          <table className="rbc-agenda-table">
            <thead>
              <tr>
                <th className="rbc-header">
                  Event
                </th>
                <th className="rbc-header custom-width">
                  Date
                </th>
                <th className="rbc-header">
                  Points
                </th>
                <th className="rbc-header">
                  Description
                </th>
              </tr>
            </thead>
          </table>
          <div className="rbc-agenda-content">
            <table className="rbc-agenda-table">
              <tbody ref={tbodyRef}>
              {events.map(event => (
                  <tr key={event.id}>
                    <td className='rbc-event-title' style={{color: getColorById(event.projectId), fontWeight: "bolder", fontSize: "25px"}}>{event.title}</td>
                    <td className='rbc-event-date'> <span style={{color: "#ca4800", fontWeight: "bolder", fontSize: 21}}>From</span> {formatDate(event.startDate)} <br/> <span style={{color: "#ca4800", fontWeight: "bolder", fontSize: 21}}>To</span> {formatDate(event.dueDate)}</td>
                    <td className='rbc-event-title'>{event.points}</td>
                    <td className='rbc-event-title'><span style={{textAlign: 'left'}}>{event.description}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    : (
      <span style={{fontSize: 30, textAlign: "center", fontWeight: "bold", color: "blueviolet" }}className="rbc-agenda-empty"> <p> You Have No Tasks!</p></span>
    )
  );  
}

// PropTypes definition
CustomAgenda.propTypes = {
  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  date: PropTypes.instanceOf(Date),
  events: PropTypes.array,
  getters: PropTypes.object.isRequired,
  length: PropTypes.number.isRequired,
  localizer: PropTypes.object.isRequired,
};

// Default props
CustomAgenda.defaultProps = {
  length: 30,
};

CustomAgenda.range = (start: any, { length = CustomAgenda.defaultProps.length, localizer }) => {
  let end = localizer.add(start, length, 'day')
  return { start, end }
}

let navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}

CustomAgenda.navigate = (
  date: any,
  action: any,
  { length = CustomAgenda.defaultProps.length, localizer }
) => {
  switch (action) {
    case navigate.PREVIOUS:
      return localizer.add(date, -length, 'day')

    case navigate.NEXT:
      return localizer.add(date, length, 'day')

    default:
      return date
  }
}

CustomAgenda.title = (start, { length = CustomAgenda.defaultProps.length, localizer }) => {
  let end = localizer.add(start, length, 'day')
  return localizer.format({ start, end }, 'agendaHeaderFormat')
}

// Export the component
export default CustomAgenda;
