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
    return <>
        <Navbar />
        <div>
            <IconButton onClick={() => router("/account/orders")}>
                <ArrowBackIcon />
            </IconButton>
            <Card style={{ width: "100%", minHeight: "75px", marginTop: "100px" }} >
                <CardContent style={{ display: "flex", gap: "10px" }}>
                    <CardMedia
                        sx={{ maxHeight: 50, minHeight: 50, minWidth: "100px", maxWidth: "250px" }}
                        image={state.imageUrl}
                    />
                    <Typography>
                        <b style={{ fontSize: "larger", opacity: "0.7" }}>{state.name}</b>
                        <p>&#8377;{state.totalAmount}</p>
                    </Typography>
                    <Typography style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "end" }}>
                        <div>
                            <p> {state.status}</p>
                        </div>
                    </Typography>
                </CardContent>
                <Typography p={"20px"}>
                    <div>
                        <p style={{ fontSize: "small" }}>Ordered At : {state.orderedAt.slice(0, 10)} <span>{state.orderedAt.slice(11, 16)}</span></p>
                        {state.deliveredAt && state.deliveredAt !== null ? <p style={{ fontSize: "small" }}>Deliverd At : {state.deliveredAt.slice(0, 10)} <span>{state.deliveredAt.slice(11, 16)}</span></p> : <></>}
                    </div>
                    <div>
                        <p>Address: <b> {state.address} </b></p>
                    </div>
                    <div>
                        <p>Restaurant Name: <b> {state.restaurant.restaurant_name} </b></p>
                    </div>
                </Typography>
            </Card>
        </div>
    </>
}

export default OrderDetails;