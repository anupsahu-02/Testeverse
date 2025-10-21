import { useEffect, useState } from "react";
import SatelliteMap from "../SatelliteMap";

import { Button, TextField } from "@mui/material";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import axios from "axios";

function MyAddress() {

    let [address, setAddress] = useState("");

    let [loading, setLoading] = useState(false);
    let [message, setMessage] = useState("");
    let [error, setError] = useState("");

    const [coords, setCoords] = useState([20.5937, 78.9629]); // default India
    const [accuracyRadius, setAccuracyRadius] = useState(100);

    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        getAddresses();
    }, [address])

    let getAddresses = async () => {
        try {
            setLoading(true);
            let res = await axios.get("http://localhost:8080/users/get-address", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            setAddresses(() => {
                return [...res.data]
            })
            setLoading(false);
        } catch(e) {
            setLoading(false);
            console.log(e);
        }
    }

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
                    console.log(res);
                    setAddress(res.data.display_name);
                    console.log(address);
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
        
        try {
            setLoading(true);
            let res = await axios.post("http://localhost:8080/users/add-address", 
            {
                address: address
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            setLoading(false);
            setAddress("");
            console.log(res);
        } catch(e) {
            setLoading(false);
            setError(e.response.data);
            console.log(e);
        }

    }


    let handleAddAddressDelete = async(address) => {
        axios.post
        try {
            let res = await axios.delete(`http://localhost:8080/users/delete-address/${address}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

            setAddresses(() => {
                return [...res.data]
            })
        } catch (e) {
            setError(e.response.data);
            console.log(e);
        }
    }


    return ( 
        <div>
            <form onSubmit={handleAddAddress} >
                <div style={{ display: "flex", flexDirection: "row", gap: "20px", margin: "20px" }}>
                    <div>
                        <TextField
                            label="Address"
                            id="outlined-start-adornment"
                            type='text'
                            sx={{ mb: 3, mt: 1, width: '55ch' }}
                            fullWidth
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div><Button onClick={getCurrentLocation} style={{ padding: "10px", marginTop: "13px" }} variant="outlined">Get Current Location</Button></div>
                    <div>
                        <Button type="submit" style={{ padding: "10px", marginTop: "13px" }} variant="contained">ADD</Button>
                    </div>     
                </div>
                <p style={{color: "red", marginLeft: "50px"}}>{error}</p> 
            </form>
            <div className="list-address">
                <h3 style={{ padding: "15px" }}>My Addrees</h3>
               {addresses && addresses.length > 0 ? 
                    addresses.map((address) => 
                        <Card style={{ width: "72vw", margin: "15px 15px", display: "flex", padding: "5px", justifyContent: "space-between" }} >
                            <CardContent>
                                {address}
                            </CardContent>
                            <Button onClick={() => handleAddAddressDelete(address)} style={{paddingTop: "0"}} size="small" color="warning" variant="outlined">
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