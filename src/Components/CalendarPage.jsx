import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const CalendarPage = () => {
  const [trainings, setTrainings] = useState([]);

  // Uusi koukku datan hakemiselle
  useEffect(() => {
    fetch('https://traineeapp.azurewebsites.net/gettrainings')
      .then(response => response.json())
      .then(data => {
        setTrainings(data);
      })
      .catch(err => console.error(err));
  }, []); //  useEffect suoritetaan vain kerran komponentin ensimmäisellä renderöinnillä

  // harjoitukset tapahtumiksi kalenteria varten
  const events = trainings.map(training => ({
    title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname} `,
    start: new Date(training.date),
    end: moment(training.date).add(training.duration, 'minutes').toDate(),
  }));
  

  return (
    <div style={{ height: '700px', width: '90%', margin: 'auto' }}>
      <Calendar
        localizer={momentLocalizer(moment)}
        events={events}
        views={['month', 'week', 'day']}
      />
    </div>
  );
};

export default CalendarPage;
