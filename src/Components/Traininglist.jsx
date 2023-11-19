import React, { useEffect, useState } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from "@mui/material/Button";
import { Snackbar } from "@mui/material";
import dayjs from 'dayjs';
import AddTraining from "./AddTraining";
import EditTraining from "./EditTraining"

export default function TrainingList() {
    // State variables
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [selectedTraining, setSelectedTraining] = useState(null);

    const dateFormatter = (params) => {
        return dayjs(params.value).format('DD.MM.YYYY HH:mm');
    }

    // Columns for ag-grid
    const columns = [
        { field: 'date', valueFormatter: dateFormatter, sortable: true, filter: true, floatingFilter: true},
        { field: 'customer.firstname', headerName: 'Customer Name', sortable: true, filter: true, floatingFilter: true }, 
        { field: 'activity', sortable: true, filter: true, floatingFilter: true },
        { field: 'duration', sortable: true, filter: true, floatingFilter: true}, // Display customer's name
        {
            cellRenderer: params => (
                <>
                    <EditTraining
                        training={params.data}
                        open={selectedTraining === params.data}
                        handleClose={() => setSelectedTraining(null)}
                        updateTraining={updateTraining}
                    />
                    <Button size="small" color="info" onClick={() => setSelectedTraining(params.data)}>
                        Edit
                    </Button>
                </>
            ),
            width: 120
        },
        {
            cellRenderer: params => (
                <Button size="small" color="error" onClick={() => deleteTraining(params.data.id)}>
                    Delete
                </Button>
            ),
            width: 120
        }
    ];

    useEffect(() => getTrainings(), []);

    const url = 'https://traineeapp.azurewebsites.net/gettrainings';

    const getTrainings = () => {
        fetch(url)
            .then(response => response.json())
            .then(responseData => {
                setTrainings(responseData);
            })
            .catch(err => console.error(err));
    }

    const deleteTraining = (trainingId) => {
        if (window.confirm('Are you sure?')) {
            fetch(`${url}/${trainingId}`, { method: 'DELETE' })
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
                if (response.ok)
                    getTrainings();
                else
                    alert('Something went wrong.')
            })
            .catch(err => console.error(err));
    }

    const updateTraining = (training) => {
        fetch(`${url}/${training.id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(training)
        })
            .then(response => {
                if (response.ok) {
                    setMsg('Training is updated successfully!');
                    setOpen(true);
                    setSelectedTraining(null);
                    getTrainings();
                } else {
                    alert('Something went wrong in update: ' + response.status);
                }
            })
            .catch(err => console.error(err));
    }

    return (
        <>
            <AddTraining addTraining={addTraining} />
            <div className="ag-theme-material" style={{ height: '700px', width: '90%', margin: 'auto' }}>
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
