import { useEffect, useState } from 'react';
import './Dashboard.css'
import axios from 'axios';

import empty_cart_img from '../../assets/undraw_empty-cart_574u.png'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { Button, TextField } from '@mui/material';

import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import { Handler } from 'leaflet';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LocationMap from './LocationMap';

function Dashboard() {

    let [orders, setOrders] = useState([]);
    let [orderDetails, setOrderDetails] = useState(null);
    let [place, setPlace] = useState("");

    const [deliverd, setDeliverd] = useState(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        getOrders();
    }, [])

    let getOrders = async() => {
        try {
            let res = await axios.get("http://localhost:8080/users/restaurant/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(res)
            setOrders(() => {
                return [...res.data]
            })
            if(res.data.length > 0) {
                setOrderDetails(() => {
                    return { ...res.data[0] }
                });
                setPlace(res.data[0].address);
            }
        } catch(e) {
            console.log(e);
        }
    }

    let handleCheckConform = async() => {
        try {
            let res = await axios.put(`http://localhost:8080/users/orders/${orderDetails.id}/deliver`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
        
            console.log(res)
            let filtered = orders.filter((order) => order.id !== orderDetails.id);  
            filtered.unshift({...res.data}) 
            setOrders(filtered);
            setOrderDetails(() => {
                return {...res.data}
            })
        } catch (e) {
            console.log(e);
        }

        setOpen(false);
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

    let handleCardClick = (order) => {
        setOrderDetails(() => {
            return {...order}
        })
        setPlace(order.address);
    }

    let bgColor = "red";

    return (
        <div className="Dashboard">
            {orders && orders.length < 1 ?
                <img style={{width: "60%", height: "60vh", margin: "auto", marginTop: "100px"}} src={empty_cart_img} />
            : <>
                    <div className='orders'>
                        {orders && orders.length > 0 ?
                            orders.map((order) =>
                                <Card onClick={() => handleCardClick(order)} style={{ width: "90%", minHeight: "80px", maxHeight: "80px", margin: "15px 15px", cursor: "pointer", backgroundColor: orderDetails.id == order.id ? "orange" : "" }} >
                                    <CardContent style={{ display: "flex", gap: "10px" }}>
                                        <CardMedia
                                            sx={{ maxHeight: 50, minHeight: 50, minWidth: "100px", maxWidth: "250px" }}
                                            image={order.imageUrl}
                                            title="imgage"
                                        />
                                        <div style={{ width: "250px", height: "10px" }}>
                                            <p style={{ fontSize: "17px", opacity: "0.7", }}> <b>{order.name}</b> </p>
                                        </div>
                                        <Typography style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "end" }}>
                                            <div>
                                                <p> {order.status}</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: "small" }}>Ordered At : {order.orderedAt.slice(0, 10)} <span>{order.orderedAt.slice(11, 16)}</span></p>
                                            </div>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                            : <>
                            </>}
                    </div>
                    <div className='order-details'>
                        {orderDetails != null && orderDetails != undefined ?
                            <>
                                <h4>Order Details</h4>
                                <hr />
                                <div className='details-box'>
                                    <div>
                                        <p style={{ fontSize: "large" }}>Customer</p>
                                        <p> Name: {orderDetails.customer.username} </p>
                                        <p> Address : {orderDetails.address} </p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: "large" }}>Item</p>
                                        Code : {orderDetails.productId} <br />
                                        Name : {orderDetails.name} <br />
                                        Total Amount : {orderDetails.totalAmount} <br />
                                    </div>
                                </div>
                                <span> Ordered At : {orderDetails.orderedAt.slice(0, 10)} <span>{orderDetails.orderedAt.slice(11, 16)} </span>
                                    |  Delivered At: {orderDetails.deliveredAt ? orderDetails.deliveredAt.slice(0, 10) : "PENDING"} <span> {orderDetails.deliveredAt ? orderDetails.deliveredAt.slice(11, 16) :"" }</span></span>
                                {orderDetails.status !== "DELIVERED" ?
                                    <div>
                                        <h5>Mark as Deliverd</h5>
                                        <ToggleButton style={{ marginLeft: "20px" }}
                                            value="check"
                                            selected={deliverd}
                                            onClick={handleClickOpen}
                                        >
                                            <CheckIcon />
                                        </ToggleButton>
                                    </div>
                                    : <></>}
                                <div style={{ borderTop: "1px solid green", paddingTop: "3px", marginTop: "5px" }}>
                                    <LocationMap locationName={place} />
                                </div>
                                <div>
                                </div>
                            </>
                            : <>
                            </>}
                        {open ? handleCheck() : <></>}
                    </div>
            </>}
        </div>
    )
}

export default Dashboard;