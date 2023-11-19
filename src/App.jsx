
import Customerlist from './Components/Customerlist'
import Traininglist from './Components/Traininglist'

import { AppBar, Typography } from '@mui/material'
import { useState } from "react";
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";

function App() {

  const [value, setValue] = useState('Customers');

  const handleChange = (event, value) => {
    setValue(value);
  }

 return (
 <>
 <AppBar position="sticky">
 <Typography variant="h5">
 PT App
 </Typography>
 </AppBar>
 <Tabs value={value} onChange={handleChange}>
        <Tab label="Customers"  value="Customers"></Tab>
        <Tab label="Training" value="Training"></Tab>
      </Tabs>
      {value === "Customers" && <Customerlist />}
      {value === "Training" && <Traininglist />}
 </>
 )
} 

export default App
