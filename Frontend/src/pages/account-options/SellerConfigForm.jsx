import './SellerConfigForm.css'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useState, useContext } from 'react';

import axios, { HttpStatusCode } from 'axios';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});


import { useNavigate, useOutletContext } from 'react-router-dom';

function SellerConfigForm() {

    let [restaurant_name, setRestaurant_name] = useState("");
    let [city, setCity] = useState("");
    let [address, setAddress] = useState("");
    let [number, setNumber] = useState();

    let [open, setOpen] = useState(false);
    let [message, setMassage] = useState("");
    let [error, setError] = useState("");

    let [loading, setLoading] = useState(false);

    let router = useNavigate();

    let { seller, showMessage, setRestaurant } = useOutletContext();
    let { getUser, setAction } = useOutletContext();

    let handleSubmitButton = async (e) => {
        e.preventDefault();
        try {
            setAction(true);
            setLoading(true);
            let response = await client.post("/users/restaurant/config", {
                restaurant_name: restaurant_name,
                city: city,
                address: address,
                number: number
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }) 
            await getUser();
            showMessage(response.data, restaurant_name);
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 5000)
            router("/account");
        } catch(e) {
            setLoading(false);
            setError(e.response.data);
        } finally {
            setAction(false);
            setLoading(false);
        }
    }

    return <>
        <div className="SellerCongig-Form-container">
            <div className='restaurant-form'>
                <Card className='restaurant-form-card'>
                    <form onSubmit={handleSubmitButton}>
                        <div class="mb-3">
                            <label for="" class="form-label">Restaurant Name</label>
                            <input
                                value={restaurant_name}
                                onChange={(e) => setRestaurant_name(e.target.value)}
                                required={true}
                                type="text" class="form-control form-control-lg" id="" />
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">City</label>
                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required={true}
                                type="text" class="form-control form-control-lg" id="" />
                        </div>
                        <div class="mb-3">
                            <label for="" class="form-label">Full Addrress</label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required={true}
                                type="text" class="form-control form-control-lg" id=""  />
                        </div>
                        <label for="" class="form-label">Number</label>
                        <div class="mb-3" style={{display: "flex", gap: "30px"}}>
                            <input
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                required={true}
                                type="number" class="form-control form-control-lg" id="" 
                                />
                        </div>
                        <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>
                        <div>
                            {loading ? 
                                <Button style={{opacity: "0.7"}} fullWidth variant='contained'>Loading..</Button>
                            : 
                                <Button type='submit' fullWidth variant='contained'>Continue</Button>
                            }
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    </>
}

export default SellerConfigForm;