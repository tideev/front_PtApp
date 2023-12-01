import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';

export default function AddTrainingToCustomer({ customer, addTraining }) {
  const [open, setOpen] = useState(false);
  const [trainingDetails, setTrainingDetails] = useState({
    date: '',
    activity: '',
    duration: '',
    customer: customer,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clearForm = () => {
    setTrainingDetails({
      date: '',
      activity: '',
      duration: '',
      customer: customer,
    });
  };
  

  const handleAddTraining = () => {
    // Kutsu addTraining-funktiota, joka on annettu propsina
    addTraining(trainingDetails.customer, trainingDetails);
    handleClose();
    clearForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrainingDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
       <Button size="small" color="primary" onClick={() => { handleOpen(); clearForm(); }}>
      Add Training
    </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Training for {customer.firstname} {customer.lastname}</DialogTitle>
        <DialogContent style={{ paddingTop: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                name="date"
                type="datetime-local"
                value={trainingDetails.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Activity"
                name="activity"
                value={trainingDetails.activity}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Duration"
                name="duration"
                value={trainingDetails.duration}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Customer"
                name="customer"
                value={`${customer.firstname} ${customer.lastname}`}
                readOnly
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddTraining} color="primary">
            Add Training
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}