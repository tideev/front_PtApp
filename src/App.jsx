import React, { useState } from 'react';
import { AppBar, Typography, Tabs, Tab } from '@mui/material';
import CustomerList from './Components/CustomerList';
import TrainingList from './Components/TrainingList';
import CalendarPage from './Components/CalendarPage';
import StatisticsPage from './Components/StatisticsPage'; 

function App() {
  const [value, setValue] = useState('Customers');
  const [trainings, setTrainings] = useState([]);

  const handleChange = (event, value) => {
    setValue(value);
  };

  return (
    <>
      <AppBar position="sticky">
        <Typography variant="h4">PT App</Typography>
      </AppBar>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Customers" value="Customers" sx={{ fontSize: '1rem' }}></Tab>
        <Tab label="Training" value="Training" sx={{ fontSize: '1rem' }}></Tab>
        <Tab label="Calendar" value="Calendar" sx={{ fontSize: '1rem' }}></Tab>
        <Tab label="Statistics" value="Statistics" sx={{ fontSize: '1rem' }}></Tab> 
      </Tabs>
      {value === 'Customers' && <CustomerList />}
      {value === 'Training' && <TrainingList />}
      {value === 'Calendar' && <CalendarPage trainings={trainings} />}
      {value === 'Statistics' && <StatisticsPage trainings={trainings} />} 
    </>
  );
}

export default App;
