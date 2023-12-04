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
                        customer={params.data} // customer details to the AddTrainingToCustomer component
                        addTraining={(customer, training) => addTrainingToCustomer(params.data.links[0].href, training)} // function to handle adding training to the customer

                    />
                </>
            ),
            width: 170
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
                    <Button size="small" variant="outlined" onClick={() => setSelectedCustomer(params.data)}>
                        <EditIcon /> Edit
                    </Button>
                </>
            ),
            width: 130
        },
        {
            cellRenderer: params => (
                <Button size="small" color="error" variant="outlined" onClick={() => deleteCustomer(params.data.links[0].href)}>
                    <DeleteIcon /> Delete
                </Button>
            ),
            width: 150
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

    const deleteCustomer = async (url) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                const response = await fetch(url, { method: 'DELETE' });
    
                if (response.ok) {
                    setMsg('Customer is deleted successfully!');
                    setOpen(true);
                    await getCustomers(); // Wait for getCustomers to finish before proceeding
                } else {
                    alert('Something went wrong in deletion: ' + response.status);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }
    

    const addTrainingToCustomer = (customer, training) => {
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

    const updateCustomer = async (url, updatedCustomer) => {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCustomer)
            });
    
            if (response.ok) {
                setMsg('Customer is updated successfully!');
                setOpen(true);
                await getCustomers(); // Wait for getCustomers to finish before proceeding
            } else {
                alert('Something went wrong in update: ' + response.status);
            }
        } catch (err) {
            console.error(err);
        }
    }
    


    // Funktion määrittely, joka vie asiakastiedot CSV-muotoon
    const exportToCSV = () => {
        // Muodostetaan asiakkaista taulukko, jossa asiakas on objekti ja  objekti sisältää tietyt tiedot
        const csvData = customers.map(customer => ({
            firstname: customer.firstname,
            lastname: customer.lastname,
            streetaddress: customer.streetaddress,
            city: customer.city,
            email: customer.email,
            phone: customer.phone,
        }));

        // Muodostetaan CSV-tiedoston sisältö
        const csvContent = "data:text/csv;charset=utf-8," +
            // Otsikot
            Object.keys(csvData[0]).map(key => key).join(", ") + "\n" +
            // Jokainen rivi = yhtä asiakasta ja asiakkaan tiedot ovat pilkuilla eroteltuna
            csvData.map(customer => Object.values(customer).join(", ")).join("\n");

        // CSV-sisältö URI-muotoon
        const encodedUri = encodeURI(csvContent);

        // Luodaan uusi linkki elementti
        const link = document.createElement("a");
        // Asetetaan linkille tarvittavat attribuutit
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customer_data.csv");
        // Lisätään linkki sivun bodyyn (HTML-dokumenttiin)
        document.body.appendChild(link);
        link.click();
    };

    return (
        <>
            <AddCustomer variant="outlined" addCustomer={addCustomer} />
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