import './Orders.css';

import { useEffect, useState } from 'react';
import emptyImg from '../../assets/nothing.png'
import axios from 'axios';
import { heIL } from '@mui/material/locale';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { Button } from '@mui/material';

function OrdersComponent() {

    let [orders, setOrders] = useState([]);
    let [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        getOrders();
    }, [])

    let getOrders = async() => {
        try {
            let res = await axios.get("http://localhost:8080/users/orders/get-orders",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            )    
            console.log(res)
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
                    <img style={{ height: "350px", margin: '90px 50px 50px 350px' }} src={emptyImg} alt="" />
                    <h4 style={{textAlign: 'center', marginLeft: '250px'}}>Place a Order..</h4>
                </>
            : <>
                <div className='orders-box'>
                        <div className='user-orders'>
                            {orders ?
                                orders.map((order) =>
                                    <Card onClick={() => handleCardClick(order)} style={{ width: "90%", minHeight: "80px", maxHeight: "80px", margin: "15px 15px", cursor: "pointer", backgroundColor: orderDetails.id == order.id ? "orange" : "" }} >
                                        <CardContent style={{ display: "flex", gap: "10px" }}>
                                            <CardMedia
                                                sx={{ maxHeight: 50, minHeight: 50, minWidth: "100px", maxWidth: "250px" }}
                                                image={order.imageUrl}
                                                title="imgage"
                                            />
                                            
                                            <div style={{width: "250px", height: "10px"}}>
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