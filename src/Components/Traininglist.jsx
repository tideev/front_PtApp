import React, { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Snackbar } from "@mui/material";
import dayjs from 'dayjs';
import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining"


export default function TrainingList() {
    // State variables
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [customers, setCustomers] = useState([]);


    const dateFormatter = (params) => {
        return dayjs(params.value).format('DD-MM-YYYY HH:mm');
    }


    // Columns for ag-grid
    const columns = [
        { field: 'date', valueFormatter: dateFormatter, sortable: true, filter: true, floatingFilter: true },
        {
            headerName: 'Customer', field: "customer",
            valueGetter: params => {
                const customer = params.data.customer;
                if (customer && customer.firstname && customer.lastname) {
                    return `${customer.firstname} ${customer.lastname}`;
                } else {
                    return '';
                }
            },
            sortable: true,
            filter: true,
            floatingFilter: true,
        },

        { field: 'activity', sortable: true, filter: true, floatingFilter: true },
        { field: 'duration', sortable: true, filter: true, floatingFilter: true },
        {
            cellRenderer: params => (
                <>
                    <EditTraining
                        training={params.data}
                        open={selectedTraining === params.data}
                        handleClose={() => setSelectedTraining(null)}
                        updateTraining={updateTraining}
                    />
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedTraining(params.data)}
                    >
                        <EditIcon />
                        Edit
                    </Button>
                </>
            ),
            width: 130
        },
        {
            cellRenderer: params => (
                <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => deleteTraining(params)}
                >
                    <DeleteIcon />
                    Delete
                </Button>
            ),
            width: 150
        }
    ];

    const getTrainings = () => {
        fetch('https://traineeapp.azurewebsites.net/gettrainings')
            .then(response => response.json())
            .then(data => {
                setTrainings(data);
            })
            .catch(err => console.error(err));
    }

    useEffect(() =>
        getTrainings(), []);

    useEffect(() => {
        getCustomers();
    }, []);

    const url = 'https://traineeapp.azurewebsites.net/api/trainings/';

    const deleteTraining = (params) => {
        if (window.confirm("Are you sure you want to delete this training?")) {
            fetch(`${url}${params.data.id}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setMsg('Training is deleted successfully!');
                        setOpen(true);
                        getTrainings();
                    } else {
                        alert('Something went wrong in deletion: ' + response.status);
                    }
                })
                .catch(err => console.error(err));
        }
    }

    const addTraining = (training) => {
        fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(training)
        })
            .then(response => {
                if (response.ok) {
                    setMsg('Training is added successfully!');
                    setOpen(true);
                    getTrainings();

                } else
                    alert('Something went wrong.')
            })
            .catch(err => console.error(err));
    }

    const updateTraining = (training) => {
        fetch(`${url}${training.id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(training)
        })
            .then(response => {
                if (response.ok) {
                    setMsg('Training is updated successfully!');
                    setOpen(true);
                    getTrainings();
                } else {
                    alert('Something went wrong in update: ' + response.status);
                }
            })
            .catch(err => console.error(err));
    }

    const getCustomers = () => {
        fetch('https://traineeapp.azurewebsites.net/api/customers')
            .then(response => response.json())
            .then(responseData => {
                setCustomers(responseData.content);
            })
            .catch(err => console.error(err));

    }

    return (
        <>
            <AddTraining addTraining={addTraining} customers={customers} />
            <div className="ag-theme-material" style={{ height: '700px', width: '95%', margin: 'auto' }}>
                {trainings.length > 0 ? (
                    <AgGridReact
                        rowData={trainings}
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
