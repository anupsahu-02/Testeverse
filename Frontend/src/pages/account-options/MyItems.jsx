import './MyItems.css'
import img from "../../assets/PizzaImg.jpeg"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import axios from 'axios';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function MyItemsComponent() {

    let [products, setProducts] = useState([]);

    const [open, setOpen] = useState(false);

    let [message, setMessage] = useState("");
    let [error, setError] = useState("");

    useEffect(() => {
        getProducts();
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let getProducts = async () => {
        try {
            let response = await client.get("/products/my-products", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setProducts(() => {
                return [...response.data]
            })
        } catch (e) {
            console.log(e);
        }
    }

    let handleUpdataButton = async() => {
        console.log("handleUpdataButton");
    }

    let handleDeleteButton = async(product) => {
        
        try {
            let response = await client.delete(`/products/delete/${product.publicId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            let filltered = products.filter((p) => p.publicId != product.publicId);
            setProducts(filltered);
            setOpen(false);
            setMessage("Product Deleted")
        } catch (e) {
            setOpen(false);
            setError("Something went wrong!")
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setMessage("");
        }, 10000)
        setTimeout(() => {
            setError("");
        }, 10000) // 10 sec
    }, [message, error]) 

    return <>
        <div className="MyItemsComponent-component">
            {message.length > 0 ? 
                <Stack style={{ position: "fixed", top: "50" }} sx={{ width: '70%' }} spacing={2} pb={2}>
                    <Alert variant="filled" severity="success" onClose={() => {setMessage("") }}>
                        {message}
                    </Alert>
                </Stack>
            : <></>}
            {error.length > 0 ?
                <Stack style={{position: "fixed", top: "60"}} sx={{ width: '70%' }} spacing={2} pb={2}>
                    <Alert variant="filled" severity="error" onClose={() => { setError("")}}>
                        {error}
                    </Alert>
                </Stack>
                : <></>}
            <div className='cards'>
                {products.length > 0 ?
                    products.map((product, idx) =>
                        <Card className='cards-card' key={idx}>
                            <CardMedia
                                className='cards-card-img'
                                image={product.imageUrl}
                            />
                            <CardContent>
                                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: "end"}}>
                                    {product.id}
                                </Typography>
                                <Typography gutterBottom variant="p" component="p">
                                    <b>{product.name}</b>
                                </Typography>
                                <Typography variant="p" component="p" mt="1px" sx={{ color: 'text.secondary' }}>
                                    &#8377; {product.price}
                                </Typography>
                            </CardContent>
                            <CardActions className='CardActions'>
                                <Button size="small">Update</Button>
                                <Button size='small' onClick={handleClickOpen}>
                                    Delete
                                </Button>
                            </CardActions>
                            
                                <React.Fragment>
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                    >
                                        <DialogTitle style={{width: "400px"}}>
                                            Do You Want to Delete?                           
                                        </DialogTitle>
                                        <DialogActions>
                                            <Button onClick={handleClose}>Cancel</Button>
                                            <Button onClick={(() => handleDeleteButton(product))} autoFocus>
                                                Delete
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </React.Fragment>
                        </Card>
                    )
                    : <></>}
            </div>
        </div>
    </>
}

export default MyItemsComponent;