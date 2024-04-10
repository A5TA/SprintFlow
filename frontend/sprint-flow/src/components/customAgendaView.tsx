import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-big-calendar';
import Agenda from 'react-big-calendar/lib/Agenda';

export default function CustomAgendaView({
  date,
  events,
  localizer,
  max = localizer.endOf(new Date(), 'day'),
  min = localizer.startOf(new Date(), 'day'),
  ...props
}) {
  const eventList = useMemo(() => getEventsForWeek(date, events, localizer), [
    date,
    events,
    localizer,
  ]);

  return (
    <Agenda
      date={date}
      localizer={localizer}
      events={eventList}
      max={max}
      min={min}
      {...props}
    />
  );
}

CustomAgendaView.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  localizer: PropTypes.object,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
};

function getEventsForWeek(date, events, localizer) {
  const start = localizer.startOf(date, 'week');
  const end = localizer.endOf(date, 'week');

  return events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return (
      (eventStart >= start && eventStart <= end) ||
      (eventEnd >= start && eventEnd <= end)
    );
  });
}

CustomAgendaView.navigate = (date, action, { localizer }) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, 'week');

    case Navigate.NEXT:
      return localizer.add(date, 1, 'week');

    default:
      return date;
  }
};

CustomAgendaView.title = (date, { localizer }) => {
  const start = localizer.startOf(date, 'week');
  const end = localizer.endOf(date, 'week');
  return localizer.format({ start, end }, 'agendaHeaderFormat');
};
