import './AddItem.css'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useState } from 'react';

import axios, { HttpStatusCode } from 'axios';

import Snackbar from '@mui/material/Snackbar';

function AddItemComponent() {


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
            let response = await axios.post("http://localhost:8080/products", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }) 
            setLoading(false);
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 5000)
            setMassage(response.data);
            
            setTitle("");
            setPrice("");
        } catch(e) {
            console.log(e.response);
            setLoading(false);
            setError(e.response.data);
        }

    }

    let handleFileChange = (e) => {
        console.log("handleFileChange invoked.")
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
                <Card sx={{ minWidth:550, maxWidth: 550, minHeight: 500 , p: 5 }}>
                    <h1 style={{marginBottom: "40px"}}>Yehh.. a new Food..</h1>
                    <form onSubmit={handleAddButton}>
                        <div class="mb-3">
                            <label for="" class="form-label">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required={true}
                                type="text" class="form-control form-control-lg" id="" placeholder="Food Title" />
                        </div>
                        <div class="mb-3">
                            <label for="formFile" class="form-label">Choose a picture for your food</label>
                            <input
                                onChange={handleFileChange}
                                required
                                class="form-control form-control-lg" type="file" id="formFile" />
                        </div>
                        <div >
                            <TextField
                                label="Price"
                                id="outlined-start-adornment"
                                type='number'
                                sx={{ mb: 3, mt: 1, width: '55ch' }}
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