import { useEffect } from "react";
import { useState } from "react"
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";

export default function Customerlist() {

    //state variables
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    //columns for ag-grid
    const columns = [
        { field: 'firstname', sortable: true, filter: true, floatingFilter: true},
        { field: 'lastname', sortable: true, filter: true, floatingFilter: true },
        { field: 'streetaddress', sortable: true, filter: true, floatingFilter: true },
        { field: 'city', sortable: true, filter: true, floatingFilter: true },
        { field: 'email', sortable: true, filter: true, floatingFilter: true },
        { field: 'phone', sortable: true, filter: true, floatingFilter: true },
        {
            cellRenderer: params => (
                <>
                    <EditCustomer
                        customer={params.data}
                        open={selectedCustomer === params.data}
                        handleClose={() => setSelectedCustomer(null)}
                        updateCustomer={updateCustomer}
                    />
                    <Button size="small" color="info" onClick={() => setSelectedCustomer(params.data)}>
                        Edit
                    </Button>
                </>
            ),
            width: 120
        },
        {
            cellRenderer: params => (
                <Button size="small" color="error" onClick={() => deleteCustomer(params.data.links[0].href)}>
                    Delete
                </Button>
            ),
            width: 120
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

    const deleteCustomer = (customerLink) => {
        const customerId = customerLink.split('/').pop();
        if (window.confirm('Are you sure?')) {
            fetch(`https://traineeapp.azurewebsites.net/api/customers/${customerId}`, { method: 'DELETE' })
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
    
    
    
    const addCustomer = (customer) => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (response.ok)
                    getCustomers();
                else
                    alert('Something went wrong.')
            })
            .catch(err => console.error(err));
    }

    const updateCustomer = (customer) => {
        fetch(customer.data._links.customer.href, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (response.ok) {
                    setMsg('Customer is updated successfully!');
                    setOpen(true);
                    setSelectedCustomer(null);
                    getCustomers();
                } else
                    alert('Something went wrong in update: ' + response.status);
            })
            .catch(err => console.error(err));
    }

    return (
        <>
            <AddCustomer addCustomer={addCustomer} />
            <div className="ag-theme-material" style={{ height: '700px', width: '90%', margin: 'auto' }}>
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