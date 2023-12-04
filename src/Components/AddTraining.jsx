import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField, Select } from "@mui/material";

import { useState } from "react";

export default function AddTraining(props) {
    // State
    const [training, setTraining] = useState({
        date: '',
        activity: '',
        duration: '',
        customer: { firstname: '' }
    });
    const [open, setOpen] = useState(false);

    // Functions
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') setOpen(false);
    };

    const handleInputChange = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    };

    const clearForm = () => {
        setTraining({
            date: '',
            activity: '',
            duration: '',
            customer: { firstname: '' }
        });
    };


    const handleSave = () => {
        props.addTraining(training);
        clearForm();
        setOpen(false);
    };


    // Return
    // Add button
    // Dialog
    return (
        <>
            <Button onClick={() => { setOpen(true); clearForm(); }}>Add New Training</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Training</DialogTitle>
                <DialogContent style={{ paddingTop: '20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label='Date'
                                name='date'
                                type='datetime-local'
                                value={training.date}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                            label='Activity' 
                            name='activity' 
                            value={training.activity} 
                            onChange={handleInputChange} 
                            fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='Duration' 
                                name='duration' 
                                value={training.duration} 
                                onChange={handleInputChange} 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Select
                                label='Customer'
                                name='customer'
                                value={training.customer}
                                onChange={handleInputChange}
                                fullWidth
                            >
                                {props.customers.map((customer, index) => (
                                    <MenuItem
                                        key={index}
                                        value={customer.links[0].href}
                                    >
                                        {`${customer.firstname} ${customer.lastname}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
