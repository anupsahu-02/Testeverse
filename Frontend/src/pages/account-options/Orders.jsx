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
        } catch(e) {
            console.log(e);
        }
    }

    return <>
        <div className="OrdersComponent-container">
            {orders && orders.length <= 0 ? 
                <>
                    <img style={{ height: "350px", margin: '90px 50px 50px 350px' }} src={emptyImg} alt="" />
                    <h4 style={{textAlign: 'center', marginLeft: '250px'}}>Place a Order..</h4>
                </>
            : <>
                <div>
                        {orders ?
                            orders.map((order) =>
                                <Card style={{ width: "72vw", height: "75px", margin: "15px 15px", display: "flex", justifyContent: "space-between" }} >
                                    <CardContent style={{display: "flex", gap: "100px"}}>
                                        <CardMedia
                                            sx={{ maxHeight: 50, minHeight: 50, minWidth: "100px",maxWidth: "250px" }}
                                            image={order.imageUrl}
                                            title="imgage"
                                        />
                                        <Typography>
                                            <b style={{ fontSize: "larger", opacity: "0.7" }}>{order.name}</b>
                                            <p>&#8377;{order.price}</p>
                                        </Typography>
                                        <Typography style={{height: "100%", width: "100%", display: "flex", alignItems: "center"}}>
                                            {!order.isDeliverd ? "On the Way" : "Deliverd"}
                                        </Typography>
                                        <Typography style={{width: "100%", textAlign: "center"}}>
                                            {order.address}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        : <></>}
                </div>
            </>}
        </div>
    </>
}

export default OrdersComponent;