import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";

export default function EditTraining(props) {
    const [training, setTraining] = useState({ date: '', activity: '', duration: '', customer: '' });

    useEffect(() => {
        if (props.training) {
            setTraining({
                date: props.training.date,
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
            <DialogContent>
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
                        <TextField label='Activity' name='activity' value={training.activity} onChange={handleInputChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Duration' name='duration' value={training.duration} onChange={handleInputChange} fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label='Customer Reference' name='customer' value={training.customer} onChange={handleInputChange} fullWidth />
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
