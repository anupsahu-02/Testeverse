import './AddItem.css'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import axios, { HttpStatusCode } from 'axios';

import Snackbar from '@mui/material/Snackbar';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function AddItemComponent() {
    let { getUser, currUser, setAction } = useOutletContext();

    let [title, setTitle] = useState("");
    let [image, setImage] = useState(null);
    let [price, setPrice] = useState();

    let [open, setOpen] = useState(false);
    let [message, setMassage] = useState("");
    let [error, setError] = useState("");

    let [loading, setLoading] = useState(false);


    let handleAddButton = async (e) => {
        let formData = new FormData();

        setError("");
        e.preventDefault();

        formData.append("name", title);
        formData.append("price", price);
        formData.append("image", image);

        try {
            setLoading(true);
            setAction(true);
            let response = await client.post("/products", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }) 
            setLoading(false);
            setOpen(true);
            setMassage(response.data);
            setTitle("");
            setPrice("");
            await getUser();
            setTimeout(() => {
                setOpen(false);
            }, 5000)
        } catch(e) {
            console.log(e.response);
            setLoading(false);
            setError(e.response.data);
        } finally {
            setAction(false);
        }

    }

    let handleFileChange = (e) => {
        setImage(e.target.files[0]);
    }

    return <>
        <div className="AddItemComponent-container">
            <div className='food-form'>
                <Snackbar
                    autoHideDuration={2}
                    open={open}
                    message={message}
                />
                <Card className='food-form-card'>
                    <h1 style={{marginBottom: "40px"}}>Yehh.. a new Food..</h1>
                    <form onSubmit={handleAddButton}>
                        <div class="mb-3">
                            <label for="" class="form-label">Name</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required={true}
                                type="text" class="form-control form-control-lg inp" id="" placeholder="Food name" />
                        </div>
                        <div class="mb-3">
                            <label for="formFile" class="form-label">Choose a picture for your food</label>
                            <input
                                onChange={handleFileChange}
                                required
                                class="form-control form-control-lg inp" type="file" id="formFile" />
                        </div>
                        <div >
                            <TextField
                                className='price-inp inp'
                                label="Price"
                                id="outlined-start-adornment"
                                type='number'
                                fullWidth
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>
                        <div>
                            {loading ? 
                                <Button style={{opacity: "0.7"}} fullWidth variant='contained'>Loading..</Button>
                            : 
                                <Button type='submit' fullWidth variant='contained'>Add</Button>
                            }
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    </>
}

export default AddItemComponent;