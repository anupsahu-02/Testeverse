import Navbar from "../Navbar";
import WithAuth from "../utils/WithAuth";
import {useNavigate , useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { use } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
const backendURL = `${import.meta.env.VITE_API_URL}`;
const client = axios.create({
    baseURL: backendURL
});

function Order() {
    const {state} = useLocation();

    const {handleOrderPlace} = useContext(UserContext);

    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState('');

    let [loading, setLoading] = useState(false);

    let router = useNavigate();

    let getAddress = async () => {
        try {
            let res = await client.get("/users/get-address", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setAddresses(() => {
                return [...res.data]
            })
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getAddress();
    }, [])

    const handleAddressChange = (event) => {
        setAddress(event.target.value)
    };

    const handleOrderPlaceInk = async() => {
        try {
            setLoading(true); 
            await handleOrderPlace(state, address);
            router("/");
        } catch(e) {console.log(e)}
        finally {setLoading(false)}
    }

    return <>
        <Navbar />
        <div className="order-p-container">
            <Card sx={{mt: 5}}>
                <CardMedia 
                    className="product-card-img"
                    image={state.imageUrl}
                    style={{margin: "10px", borderRadius: "4px"}}
                />
                <CardContent>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography gutterBottom variant="p" component="p">
                            <b>{state.name}</b>
                        </Typography>
                        <Typography sx={{ textAlign: "end" }}>
                            {state.restaurant.restaurant_name}
                        </Typography>
                    </div>
                    <Typography variant="p" component="p" mt="1px" sx={{ color: 'text.secondary', p: "0" }}>
                        &#8377; {state.price}
                    </Typography>
                    <Box sx={{ minWidth: 120, mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="">Address</InputLabel>
                            <Select
                                value={address}
                                label="Address"
                                type="text"
                                required
                                onChange={(e) => setAddress(e.target.value)}
                            >
                                {addresses.map((add, idx) =>
                                    <MenuItem key={idx} value={add}>{add}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>
                    <CardActions>
                        {!loading ? <Button onClick={handleOrderPlaceInk} sx={{ mt: 2 }} variant="contained" size="small">Order Now</Button> 
                        : <Button sx={{opacity: 0.5}}>Loading..</Button>}
                    </CardActions>
                </CardContent>
            </Card>
        </div>
    </>
}

export default WithAuth(Order);