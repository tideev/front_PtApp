import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Tabs, Tab } from '@mui/material';
import CustomerList from './Components/Customerlist';
import TrainingList from './Components/Traininglist';
import CalendarPage from './Components/CalendarPage';
import StatisticsPage from './Components/StatisticsPage'; // Import the new component

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
        <Tab label="Customers" value="Customers"></Tab>
        <Tab label="Training" value="Training"></Tab>
        <Tab label="Calendar" value="Calendar"></Tab>
        <Tab label="Statistics" value="Statistics"></Tab> {/* Add a new tab for Statistics */}
      </Tabs>
      {value === 'Customers' && <CustomerList />}
      {value === 'Training' && <TrainingList />}
      {value === 'Calendar' && <CalendarPage trainings={trainings} />}
      {value === 'Statistics' && <StatisticsPage trainings={trainings} />} {/* Render StatisticsPage when selected */}
    </>
  );
}

export default App;
