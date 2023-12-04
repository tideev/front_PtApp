import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from 'dayjs';

export default function EditTraining(props) {
    const [training, setTraining] = useState({ date: '', activity: '', duration: '', customer: '' });

    useEffect(() => {
        if (props.training) {
            setTraining({
                date: dayjs(props.training.date).format('YYYY-MM-DDTHH:mm'),
                activity: props.training.activity,
                duration: props.training.duration,
                customer: props.training.customer
            });
        }
    }, [props.training]);

    const handleInputChange = (event) => {
        setTraining({ ...training, [event.target.name]: event.target.value });
    }

    const handleSave = () => {
        props.updateTraining({ ...props.training, ...training });
        props.handleClose();
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle>Edit Training</DialogTitle>
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
                        <TextField
                            label='Customer Name'
                            name='customer'
                            value={`${training.customer.firstname} ${training.customer.lastname}`}
                            onChange={handleInputChange}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Close</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
