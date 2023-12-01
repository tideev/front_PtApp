import { useEffect } from "react";
import { useState } from "react"
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Snackbar } from "@mui/material";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import AddTrainingToCustomer from "./AddTrainingToCustomer";


export default function Customerlist() {

    //state variables
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);


    //columns for ag-grid
    const columns = [
        { field: 'firstname', sortable: true, filter: true, floatingFilter: true },
        { field: 'lastname', sortable: true, filter: true, floatingFilter: true },
        { field: 'streetaddress', sortable: true, filter: true, floatingFilter: true },
        { field: 'city', sortable: true, filter: true, floatingFilter: true },
        { field: 'email', sortable: true, filter: true, floatingFilter: true },
        { field: 'phone', sortable: true, filter: true, floatingFilter: true },
        {
            cellRenderer: params => (
                <>
                    <AddTrainingToCustomer
                        customer={params.data} // Pass the customer details to the AddTrainingToCustomer component
                        addTraining={(customer, training) => addTrainingToCustomer(params.data.links[0].href, training)} // Pass a function to handle adding training to the customer

                    />
                </>
            ),
            width: 130
        },
        {
            cellRenderer: params => (
                <>
                    <EditCustomer
                        customer={params.data}
                        open={selectedCustomer === params.data}
                        handleClose={() => setSelectedCustomer(null)}
                        updateCustomer={updatedCustomer => updateCustomer(params.data.links[0].href, updatedCustomer)}
                    />
                    <Button size="small" color="info" onClick={() => setSelectedCustomer(params.data)}>
                        <EditIcon /> Edit
                    </Button>
                </>
            ),
            width: 120
        },
        {
            cellRenderer: params => (
                <Button size="small" color="error" onClick={() => deleteCustomer(params.data.links[0].href)}>
                    <DeleteIcon /> Delete
                </Button>
            ),
            width: 140
        }

    ];

    useEffect(() => getCustomers(), [])

    const url = 'https://traineeapp.azurewebsites.net/api/customers';

    const getCustomers = () => {
        fetch(url)
            .then(response => response.json())
            .then(responseData => {
                setCustomers(responseData.content);
            })
            .catch(err => console.error(err));

    }

    const deleteCustomer = (url) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            fetch(url, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setMsg('Customer is deleted successfully!');
                        setOpen(true);
                        getCustomers();
                    } else {
                        alert('Something went wrong in deletion: ' + response.status);
                    }
                })
                .catch(err => console.error(err));
        }
    }

    const addTrainingToCustomer = ( customer, training) => {
        const trainingData = {
            date: training.date,
            duration: training.duration,
            activity: training.activity,
            customer: {

                firstname: customer.firstname,
                lastname: customer.lastname
            },
          };
        fetch(`https://traineeapp.azurewebsites.net/api/trainings/`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(trainingData)
        })
            .then(response => {
                if (response.ok) {
                    setMsg('Training is added successfully!');
                    setOpen(true);
                    getCustomers();
                } else {
                    // Lisätty virheenkäsittely tässä
                    return response.json();
                }
            })
            .then(errorData => {
                // Tulosta virheviesti konsoliin
                console.error('Error in adding training:', errorData);
            })
            .catch(err => console.error(err));
    };
    


    const addCustomer = (customer) => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (response.ok) {
                    setMsg('Customer is added successfully!');
                    setOpen(true);
                    getCustomers();
                } else
                    alert('Something went wrong.')
            })
            .catch(err => console.error(err));
    }

    const updateCustomer = (url, updatedCustomer) => {
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCustomer)
        })
            .then(response => {
                if (response.ok) {
                    setMsg('Customer is updated successfully!');
                    setOpen(true);
                    getCustomers();
                } else {
                    alert('Something went wrong in update: ' + response.status);
                }
            })
            .catch(err => console.error(err));
    }


    const exportToCSV = () => {
        const csvData = customers.map(customer => ({
            firstname: customer.firstname,
            lastname: customer.lastname,
            streetaddress: customer.streetaddress,
            city: customer.city,
            email: customer.email,
            phone: customer.phone,
        }));

        const csvContent = "data:text/csv;charset=utf-8," +
            Object.keys(csvData[0]).map(key => key).join(", ") + "\n" +
            csvData.map(customer => Object.values(customer).join(", ")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customer_data.csv");
        document.body.appendChild(link);
        link.click();
    }

    return (
        <>
            <AddCustomer variant="contained" addCustomer={addCustomer} />
            <Button onClick={exportToCSV}>
                Export to CSV
            </Button>
            <div className="ag-theme-material" style={{ height: '700px', width: '95%', margin: 'auto' }}>
                {customers.length > 0 ? (
                    <AgGridReact
                        rowData={customers}
                        columnDefs={columns}
                        rowSelection="single"
                        animateRows={true}
                        pagination={true}
                        paginationPageSize={10}
                    ></AgGridReact>

                ) : (
                    <p>Loading...</p>
                )}

                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message={msg}
                />

            </div>
        </>
    )
}