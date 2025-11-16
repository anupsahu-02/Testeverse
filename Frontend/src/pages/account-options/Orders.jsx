import './Orders.css';

import { useEffect, useState } from 'react';
import emptyImg from '../../assets/nothing.png'
import axios from 'axios';
import { heIL } from '@mui/material/locale';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { Button, unstable_toUnitless } from '@mui/material';

import { useOutletContext } from 'react-router-dom';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function OrdersComponent() {

    let [orders, setOrders] = useState([]);
    let [orderDetails, setOrderDetails] = useState(null);
    
    let {currUser} = useOutletContext();

    useEffect(() => {
        // if(currUser && currUser != null) {
        //     getOrders();
        // }
        getOrders();
    }, [])


    // let getOrders = () => {
    //     setOrders(() => {
    //         return [...currUser.orders]
    //     })
    //     if (currUser.orders.length > 0) {
    //         setOrderDetails(() => {
    //             return { ...currUser.orders[0] }
    //         })
    //     }
    // }

    let getOrders = async() => {
        try {
            let res = await client.get("/users/orders/get-orders",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            )    
            setOrders(() => {
                return [...res.data]
            })
            if(res.data.length > 0) {
                setOrderDetails(() => {
                    return { ...res.data[0] }
                })
            }
        } catch(e) {
            console.log(e);
        }
    }

    let handleCardClick = (order) => {
        setOrderDetails(() => {
            return { ...order }
        })
    }

    return <>
        <div className="OrdersComponent-container">
            {orders && orders.length <= 0 ? 
                <>
                    <img src={emptyImg} alt="" />
                    <h4>Place a Order..</h4>
                </>
            : <>
                <div className='orders-box'>
                        <div className='user-orders'>
                            {orders ?
                                orders.map((order) =>
                                    <Card className='user-order-card' onClick={() => handleCardClick(order)} style={{cursor: "pointer", backgroundColor: orderDetails.id == order.id ? "orange" : "" }} >
                                        <CardContent style={{ display: "flex", gap: "10px"}}>
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
                                : <></>}
                        </div>
                        <div className='user-order-details'>
                            <Card style={{width: "100%", minHeight: "75px", marginTop: "100px" }} >
                                <CardContent style={{ display: "flex", gap: "10px" }}>
                                    <CardMedia
                                        sx={{ maxHeight: 50, minHeight: 50, minWidth: "100px", maxWidth: "250px" }}
                                        image={orderDetails.imageUrl}
                                        title="imgage"
                                    />
                                    <Typography>
                                        <b style={{ fontSize: "larger", opacity: "0.7" }}>{orderDetails.name}</b>
                                        <p>&#8377;{orderDetails.totalAmount}</p>
                                    </Typography>
                                    <Typography style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "end" }}>
                                        <div>
                                            <p> {orderDetails.status}</p>
                                        </div>
                                    </Typography>
                                </CardContent>
                                <Typography p={"20px"}>
                                    <div>
                                        <p style={{ fontSize: "small" }}>Ordered At : {orderDetails.orderedAt.slice(0, 10)} <span>{orderDetails.orderedAt.slice(11, 16)}</span></p>
                                        {orderDetails.deliveredAt && orderDetails.deliveredAt !== null ? <p style={{ fontSize: "small" }}>Deliverd At : {orderDetails.deliveredAt.slice(0, 10)} <span>{orderDetails.deliveredAt.slice(11, 16)}</span></p> : <></>}
                                    </div>
                                    <div>
                                        <p>Address: <b> {orderDetails.address} </b></p>
                                    </div>
                                    <div>
                                        <p>Restaurant Name: <b> {orderDetails.restaurant.restaurant_name} </b></p>
                                    </div>
                                </Typography>
                            </Card>
                        </div>
                </div>

            </>}
        </div>
    </>
}

export default OrdersComponent;