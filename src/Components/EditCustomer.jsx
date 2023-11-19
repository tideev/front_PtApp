import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState, useEffect } from "react";

export default function EditCustomer(props) {
    const [customer, setCustomer] = useState({ firstname: '', lastname: '', streetaddress: '', postcode: '', city: '', email: '', phone: '' });

    useEffect(() => {
        if (props.customer) {
            setCustomer({
                firstname: props.customer.firstname,
                lastname: props.customer.lastname,
                streetaddress: props.customer.streetaddress,
                postcode: props.customer.postcode,
                city: props.customer.city,
                email: props.customer.email,
                phone: props.customer.phone
            });
        }
    }, [props.customer]);

    const handleInputChange = (event) => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    }
    

    const handleSave = () => {
        props.updateCustomer({ ...props.customer, ...customer });
        props.handleClose();
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
        >
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField label='Firstname' name='firstname' value={customer.firstname} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='Lastname' name='lastname' value={customer.lastname} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Street Address' name='streetaddress' value={customer.streetaddress} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='Postcode' name='postcode' value={customer.postcode} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField label='City' name='city' value={customer.city} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Email' name='email' value={customer.email} onChange={handleInputChange} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='Phone' name='phone' value={customer.phone} onChange={handleInputChange} fullWidth />
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
