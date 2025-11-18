import { IconButton } from '@mui/material';
import Navbar from '../../../src/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import LocationMap from './LocationMap';
import ToggleButton from '@mui/material/ToggleButton';
import { useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import * as React from 'react';
import { Button, TextField } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function OrderDetDashboard() {
    
    let router = useNavigate();
    let { state } = useLocation();
    const [deliverd, setDeliverd] = useState(false);
    const [open, setOpen] = useState(false);
    let place = state.address;
    console.log(state)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let handleCheckConform = async () => {
        try {
            let res = await client.put(`/users/orders/${state.id}/deliver`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            router("/account/dashboard/order/info", {
                state: res.data
            })
        } catch (e) {
            console.log(e);
        } finally {
            setOpen(false);
        }
    }

    let handleCheck = () => {
        return (
            <React.Fragment>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle style={{ width: "400px" }} id="alert-dialog-title">
                        Mark as Deliverd
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This can't be changed later!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleCheckConform} autoFocus>
                            Conform
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }

    return <>
        <Navbar />
        <div>
            <IconButton onClick={() => router("/account/dashboard")}>
                <ArrowBackIcon />
            </IconButton>
            <hr />
            <div style={{padding: "10px"}} className='details-box'>
                <div>
                    <p> <b>Customer</b> </p>
                    <span style={{ color: "gray", fontFamily: "monospace" }}>Name: {state.customer_name}</span> <br />
                    <span style={{ color: "gray", fontFamily: "monospace" }}>Address: {state.address}</span>
                </div>
                <hr />
                <div>
                    <p> <b>Item</b> </p>
                    <span style={{ color: "gray", fontFamily: "monospace" }}> Code : {state.productId} </span> <br />
                    <span style={{ color: "gray", fontFamily: "monospace" }}> Name : {state.name} </span> <br />
                    <span style={{ color: "gray", fontFamily: "monospace" }}> Total Amount : {state.totalAmount} </span> <br />
                </div>
                <span style={{ color: "gray", fontFamily: "monospace" }}><span> Ordered At : {state.orderedAt.slice(0, 10)} <span>{state.orderedAt.slice(11, 16)} </span>
                    <br />
                </span>  Delivered At: {state.deliveredAt ? state.deliveredAt.slice(0, 10) : "PENDING"} <span> {state.deliveredAt ? state.deliveredAt.slice(11, 16) : ""}</span></span>
            </div>
            {state.status !== "DELIVERED" ?
                <div>
                    <span style={{fontFamily: "monospace" }}><p style={{marginLeft: "5px"}}>Mark as Deliverd</p></span>
                    <ToggleButton style={{ marginLeft: "20px" }}
                        value="check"
                        selected={deliverd}
                        onClick={handleClickOpen}
                    >
                        <CheckIcon />
                    </ToggleButton>
                </div>
                : <></>}
            <div style={{ borderTop: "1px solid green", paddingTop: "3px", margin: "5px"}}>
                <LocationMap locationName={place} />
            </div>
            {open ? handleCheck() : <></>}
        </div>
    </>
}

export default OrderDetDashboard;