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
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function Dashboard() {

    let [orders, setOrders] = useState([]);
    let [orderDetails, setOrderDetails] = useState(null);
    let [place, setPlace] = useState("");
    const [deliverd, setDeliverd] = useState(false);
    const [open, setOpen] = React.useState(false);

    let { getUser, currUser, setAction } = useOutletContext();
    
    let router = useNavigate();

    useEffect(() => {
        getOrders();
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let getOrders = async() => {
        try {
            let res = await client.get("/users/restaurant/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setOrders(() => {
                return [...res.data]
            })
            if(res.data.length > 0 && window.innerWidth > 480) {
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
            setAction(true);
            let res = await client.put(`/users/orders/${orderDetails.id}/deliver`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
        
            await getOrders();
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

    let handleCardClick = (order) => {
        if (window.innerWidth <= 480) {
            router("/account/dashboard/order/info", {
                state: order
            })
        }
        setOrderDetails(() => {
            return {...order}
        })
        setPlace(order.address);
    }

    let bgColor = "red";

    return (
        <div className="Dashboard">
            {orders && orders.length < 1 ?
                <img src={empty_cart_img} />
            : <>
                    <div className='orders'>
                        {orders && orders.length > 0 ?
                            orders.map((order) =>
                                <Card className='user-order-card' onClick={() => handleCardClick(order)} style={{ backgroundColor: orderDetails && orderDetails.id == order.id ? "orange" : "" }} >
                                    <CardContent style={{ display: "flex", gap: "10px" }}>
                                        <CardMedia
                                            className='user-order-card-img'
                                            image={order.imageUrl}
                                        />
                                        <div className='user-order-card-name'>
                                            <p style={{ fontSize: "17px", opacity: "0.7", }}> <b>{order.name}</b> </p>
                                        </div>
                                        <Typography style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "end" }}>
                                            <div className='user-order-card-status'>
                                                <p> {order.status}</p>
                                            </div>
                                            <div className='user-order-card-date'>
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
                                        <p> Name: {orderDetails.customer_name} </p>
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