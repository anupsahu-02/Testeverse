import './Orders.css';

import { useEffect, useState, useRef } from 'react';
import emptyImg from '../../assets/nothing.png'
import axios from 'axios';
import { heIL } from '@mui/material/locale';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { Button, unstable_toUnitless } from '@mui/material';

import { useLocation, useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function OrdersComponent() {

    let [orders, setOrders] = useState([]);
    let [orderDetails, setOrderDetails] = useState(null);
    let [fetchingOrders, setFetchingOrders] = useState(false);
    
    let {currUser} = useOutletContext();

    const router = useNavigate();
    const location = useLocation();

    // REF for the scrollable container (the div that actually scrolls)
    const listRef = useRef(null);

    useEffect(() => {
        getOrders();
    }, [])

    // Restore scroll AFTER orders are loaded (use orders dependency)
    useEffect(() => {
        // Only try restore if listRef exists and orders are rendered
        const saved = sessionStorage.getItem('ordersScroll');
        if (saved && listRef.current) {
            // convert to number and set
            listRef.current.scrollTop = Number(saved);
            // remove after restoring so it doesn't persist forever
            sessionStorage.removeItem('ordersScroll');
        }

        // Also support location.state if you still have it (optional compatibility)
        if (location.state?.savedScroll && listRef.current) {
            listRef.current.scrollTop = Number(location.state.savedScroll);
        }
    }, [orders]); // run after orders loaded / changed

    let getOrders = async() => {
        try {
            setFetchingOrders(true)
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
            if(res.data.length > 0 && window.innerWidth > 480) {
                setOrderDetails(() => {
                    return { ...res.data[0] }
                })
            }
        } catch(e) {
            console.log(e);
        } finally {
            setFetchingOrders(false)
        }
    }

    let handleCardClick = (order) => {
        // Get scrollTop of scrollable container (not window)
        const scrollTop = listRef.current ? listRef.current.scrollTop : 0;
        if (window.innerWidth <= 480) {
            sessionStorage.setItem("comingBack", "false");
            // Save to sessionStorage before navigating forward
            sessionStorage.setItem('ordersScroll', String(scrollTop));

            router("/account/orders/order/info", {
                state: {
                    order,
                }
            })
            return;
        }

        setOrderDetails(() => {
            return { ...order }
        })
    }

    let SkeletonsView = () => {
        return (
            <Stack className='ordersSkeletons' spacing={1}>
                <Skeleton variant="rounded" style={{ width: "100%", height: "70px" }} />
                <Skeleton variant="rounded" style={{width: "100%", height: "70px"}} />
                <Skeleton variant="rounded" style={{width: "100%", height: "70px"}} />
                <Skeleton variant="rounded" style={{ width: "100%", height: "70px" }} />
                <Skeleton variant="rounded" style={{ width: "100%", height: "70px" }} />
                <Skeleton variant="rounded" style={{ width: "100%", height: "70px" }} />
                <Skeleton variant="rounded" style={{ width: "100%", height: "70px" }} />
                <Skeleton variant="rounded" style={{ width: "100%", height: "70px" }} />
                <Skeleton variant="rounded" style={{ width: "100%", height: "70px" }} />
            </Stack>
        );
    }

    return <>
        <div className="OrdersComponent-container">
            {!fetchingOrders && orders && orders.length <= 0 ? 
                <>
                    <img src={emptyImg} alt="" />
                </>
            : <>
                <div className='orders-box'>
                        <div className='user-orders' ref={listRef} style={{ overflowY: 'auto'}}>
                            {fetchingOrders ? 
                                <>
                                    <SkeletonsView />
                                </>
                            : <></>}
                            {orders ?
                                orders.map((order) =>
                                    <Card className='user-order-card' onClick={() => handleCardClick(order)} style={{ cursor: "pointer", backgroundColor: orderDetails && orderDetails.id == order.id ? "orange" : "" }} >
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
                        {orderDetails ? 
                            <div className='user-order-details'>
                                <Card style={{width: "100%", minHeight: "75px", marginTop: "100px" }} >
                                    <CardContent style={{ display: "flex", gap: "10px" }}>
                                        <CardMedia
                                            sx={{ maxHeight: 50, minHeight: 50, minWidth: "100px", maxWidth: "250px" }}
                                            image={orderDetails.imageUrl}
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
                        : <></>}
                </div>

            </>}
        </div>
    </>
}

export default OrdersComponent;