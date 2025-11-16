import './MyAddress.css'
import { useEffect, useState } from "react";
import SatelliteMap from "../SatelliteMap";

import { Button, TextField } from "@mui/material";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { useOutletContext } from 'react-router-dom';

import axios from "axios";

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function MyAddress() {

    let [address, setAddress] = useState("");

    let [loading, setLoading] = useState(false);
    let [message, setMessage] = useState("");
    let [error, setError] = useState("");

    const [coords, setCoords] = useState([20.5937, 78.9629]); // default India
    const [accuracyRadius, setAccuracyRadius] = useState(100);

    const [addresses, setAddresses] = useState([]);

    let { getUser, currUser, setAction } = useOutletContext();

    useEffect(() => {
        getAddresses();
    }, [currUser])

    let getAddresses = () => {
        if(currUser && currUser != null) {
            setAddresses(() => {
                return [...currUser.address]
            })
        } else {
            setLoading(true);
        }
    }

    // let getAddresses = async () => {
    //     try {
    //         setLoading(true);
    //         let res = await client.get("/users/get-address", {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`
    //             }
    //         })
    //         setAddresses(() => {
    //             return [...res.data]
    //         })
    //         setLoading(false);
    //     } catch(e) {
    //         setLoading(false);
    //         console.log(e);
    //     }
    // }

    // Get current location
    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setCoords([lat, lon]);
                setAccuracyRadius(pos.coords.accuracy || 50);
                try {
                    const res = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );
                    setAddress(res.data.display_name);
                } catch {
                    console.log(e);
                }
            },
            (err) => {
                console.error("GPS error:", err);
                alert("Could not get your current location!");
            },
            { enableHighAccuracy: true, timeout: 7000 }
        );
    };

    let handleAddAddress = async (e)=> {
        e.preventDefault();
        setAction(true);
        try {
            setLoading(true);
            let res = await client.post("/users/add-address", 
            {
                address: address
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })


            try {
                await getUser();
            } catch(e) { console.log(e) }
            finally {setAction(false)}

            setLoading(false);
            setAddress("");
        } catch(e) {
            setLoading(false);
            setError(e.response.data);
            console.log(e);
        }

    }


    let handleAddAddressDelete = async(address) => {
        try {
            setAction(true);
            let res = await client.delete(`/users/delete-address/${address}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

            setAddresses(() => {
                return [...res.data]
            })
            try {
                await getUser();
            } catch (e) { console.log(e) }
            finally { setAction(false) }
        } catch (e) {
            setError(e.response.data);
            console.log(e);
        }
    }


    return ( 
        <div>
            <form onSubmit={handleAddAddress} >
                <div className="address-form-box">
                    <div>
                        <TextField
                            className='address-form-inp'
                            label="Address"
                            id="outlined-start-adornment"
                            type='text'
                            fullWidth
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className='address-form-btns'>
                        <div><Button className='address-form-btn' onClick={getCurrentLocation} style={{ padding: "10px", marginTop: "13px" }} variant="outlined">Get Current Location</Button></div>
                        <div>
                            <Button className='address-form-btn' type="submit" style={{ padding: "10px", marginTop: "13px" }} variant="contained">ADD</Button>
                        </div>      
                    </div>   
                </div>
                <p style={{color: "red", marginLeft: "50px"}}>{error}</p> 
            </form>
            <div className="list-address">
                <hr />
                <h3>My Addrees</h3>
               {addresses && addresses.length > 0 ? 
                    addresses.map((address) => 
                        <Card className='list-address-card'>
                            <CardContent>
                                {address}
                            </CardContent>
                            <Button className='list-address-card-btn' onClick={() => handleAddAddressDelete(address)} size="small" color="warning" variant="outlined">
                                Delete
                            </Button>
                        </Card>
                    )
               : <></>}
            </div>
        </div>
    );
}

export default MyAddress;