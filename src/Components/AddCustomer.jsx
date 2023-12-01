import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState } from "react";

export default function AddCustomer(props) {
    //state
    const [customer, setCustomer] = useState({
        firstname: '',
        lastname: '',
        streetaddress: '',
        postcode: '',
        city: '',
        email: '',
        phone: ''
    });
    const [open, setOpen] = useState(false);

    //functions
    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') setOpen(false);
    };

    const handleInputChange = (event) => {
        setCustomer({ ...customer, [event.target.name]: event.target.value });
    };

    const clearForm = () => {
        setCustomer({
          firstname: '',
          lastname: '',
          streetaddress: '',
          postcode: '',
          city: '',
          email: '',
          phone: ''
        });
      };
      

    const handleSave = () => {
        props.addCustomer(customer);
        setOpen(false);
        clearForm();
    };

    //return
    //add button
    //dialog
    return (
        <>
             <Button onClick={() => { setOpen(true); clearForm(); }}>Add New Customer</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Customer</DialogTitle>
                <DialogContent style={{ paddingTop: '20px' }}>
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
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
