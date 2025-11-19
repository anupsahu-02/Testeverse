// OrderDetails.jsx
import { IconButton } from '@mui/material';
import Navbar from '../../../src/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

function OrderDetails() {
    let router = useNavigate();
    const { state } = useLocation();
    const goBack = () => {
        router(-1);
    };

    const order = state?.order;

    return <>
        <Navbar />
        <div>
            <IconButton onClick={goBack}>
                <ArrowBackIcon />
            </IconButton>

            {order ? (
                <Card style={{ width: "100%", minHeight: "75px", marginTop: "100px" }} >
                    <CardContent style={{ display: "flex", gap: "10px" }}>
                        <CardMedia
                            sx={{ maxHeight: 50, minHeight: 50, minWidth: "100px", maxWidth: "250px" }}
                            image={order.imageUrl}
                        />
                        <Typography>
                            <b style={{ fontSize: "larger", opacity: "0.7" }}>{order.name}</b>
                            <p>&#8377;{order.totalAmount}</p>
                        </Typography>
                        <Typography style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "end" }}>
                            <div>
                                <p> {order.status}</p>
                            </div>
                        </Typography>
                    </CardContent>
                    <Typography p={"20px"}>
                        <div>
                            <p style={{ fontSize: "small" }}>Ordered At : {order.orderedAt.slice(0, 10)} <span>{order.orderedAt.slice(11, 16)}</span></p>
                            {order.deliveredAt && order.deliveredAt !== null ? <p style={{ fontSize: "small" }}>Deliverd At : {order.deliveredAt.slice(0, 10)} <span>{order.deliveredAt.slice(11, 16)}</span></p> : <></>}
                        </div>
                        <div>
                            <p>Address: <b> {order.address} </b></p>
                        </div>
                        <div>
                            <p>Restaurant Name: <b> {order.restaurant.restaurant_name} </b></p>
                        </div>
                    </Typography>
                </Card>
            ) : (
                <div style={{ padding: 20 }}>
                    <p>No order data available</p>
                </div>
            )}
        </div>
    </>
}

export default OrderDetails;
