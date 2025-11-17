import Navbar from "../Navbar";
import "./Home.css"
import img from "../assets/PizzaImg.jpeg"

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from "react-draggable";

import axios from "axios";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Snackbar } from "@mui/material";

import Skeleton from '@mui/material/Skeleton';
import PropTypes, { array, objectOf } from 'prop-types';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { idID } from "@mui/material/locale";
import { useNavigate } from "react-router-dom";

import Slide from '@mui/material/Slide';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { UserContext } from "../contexts/UserContext";

function Home() {

    let itmes = [];

    let { handleOrderPlace } = useContext(UserContext);

    let [data, setData] = useState([]);

    let [error, setError] = useState("");

    let [isLoading, setIsLoading] = useState(true);

    let [isAlert, setIsAlert] = useState(false);

    let [open, setOpen] = useState(false);

    let [opneOrder, setOpenOrder] = useState(false);

    let [message, setMessage] = useState("");

    let [selectedProduct, setSelectedProducts] = useState(null);

    let router = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState('');

    const handleAddressChange = (event) => {
        setAddress(event.target.value)
    };

    const backendURL = `${import.meta.env.VITE_API_URL}`;

    const client = axios.create({
        baseURL: backendURL
    });

    let getAddress = async() => {
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

    const handleClickOpen = () => {
        setIsAlert(true);
    };

    const handleClose = () => {
        setIsAlert(false);
    };
 
    useEffect(() => {
        getData();
    }, [])

    let getData = async() => {
        try {
            let res = await client.get("/public/all-products");
            setData(() => {
                return [...res.data]
            });
            setIsLoading(false);
        } catch(e) {
            console.log(e);   
        }
    }

    let handleAddToCart = async(product) => {
        if(!localStorage.getItem("token")) {
            setIsAlert(true);
        } else {
            setIsAlert(false);
        }
        
        try {
            let res = await client.post(`/products/add-to-cart/${product.id}`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            })
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 5000)
            setMessage("Added.")
        } catch(e) {
            console.log(e)
            console.log("Somthing went Wrong! while adding to cart.");
        }
    }

    let loginDialog = () => {
        return (
            <React.Fragment >
                <Dialog
                    open={isAlert}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle width={300} id="alert-dialog-title">
                        {"Please Login."}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={() => router("/auth")} autoFocus>
                            Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment> 
        )    
    }

    function PaperComponent(props) {
        const nodeRef = React.useRef(null);
        return (
            <Draggable
                nodeRef={nodeRef}
                handle="#draggable-dialog-title"
                cancel={'[class*="MuiDialogContent-root"]'}
            >
                <Paper {...props} ref={nodeRef} />
            </Draggable>
        );
    }

    let handleOrderPlaceInk = async(product) => {
        try {
            await handleOrderPlace(product, address);
            setOpenOrder(false);
        } catch(e) { 
            setError(e);
        }
    }

    let orderDialog = () => {
        return (
           <>
                {selectedProduct ?
                    <React.Fragment >
                        <Dialog
                            open={opneOrder}
                            onClose={handleOrderClose}
                        >
                            <DialogContent>
                                <Card className="order-product-card">
                                    <CardMedia className="order-product-card-media"
                                        sx={{ maxHeight: 250, minHeight: 200 }}
                                        image={selectedProduct.imageUrl}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="p" component="p">
                                            <b>{selectedProduct.name}</b>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        </Typography>
                                        <Typography variant="p" component="p" mt="1px" sx={{ color: 'text.secondary' }}>
                                            &#8377; {selectedProduct.price}
                                        </Typography>
                                        <Box sx={{ minWidth: 120, mt:2 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="">Address</InputLabel>
                                                <Select

                                                    value={address}
                                                    label="Address"
                                                    type="text"
                                                    onChange={(e) => setAddress(e.target.value)}
                                                >
                                                    {addresses.map((add, idx) => 
                                                        <MenuItem key={idx} value={add}>{add}</MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                            <p style={{color: "red"}}>{error}</p>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => handleOrderPlaceInk(selectedProduct)}>ORDER</Button>
                                    </CardActions>
                                </Card>
                            </DialogContent>
                        </Dialog>
                    </React.Fragment >
                : <></>}
           </>
        )
    }

    let loadingSize = [1,1,1,1,1,1,1,1,1];
    let showLoading = ()=> {
       return (
           <Grid>
               <Skeleton variant="rectangular" sx={{ minWidth: 390, maxWidth: 350, height: 150 }} />
               <Box sx={{ pt: 0.5 }}>
                   <Skeleton />
                   <Skeleton width="250px" />
               </Box>
           </Grid>
       )
    }

    let handleOrderOpen = (product) => {
        setError("");
        if (!localStorage.getItem("token")) {
            setIsAlert(true);
        } else {
            if(window.innerWidth <= 480) {
                router("/new-order", {
                    state : product
                })
            } 
            setIsAlert(false);
            setSelectedProducts(product)
            getAddress();
            setOpenOrder(true);
        }
    }

    let handleOrderClose = () => {
        setOpenOrder(false);
    }

    return <>
        <Navbar />  

        <div className="Home-Container">
            <div className="product-container">
                {isLoading ?
                    <>
                        {loadingSize.map(() =>
                            showLoading()
                        )}
                    </>

                    : <></>}
                {data.length > 0 ?
                    data.map((product, idx) =>
                        <Card className="product-card" key={idx}>
                            <CardMedia
                                className="product-card-img"
                                image={product.imageUrl}
                            />
                            <CardContent className="product-card-contend">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <Typography gutterBottom variant="p" component="p">
                                        <b>{product.name}</b>
                                    </Typography>
                                    <Typography sx={{ textAlign: "end" }}>
                                        {product.restaurant.restaurant_name}
                                    </Typography>
                                </div>
                                <Typography variant="p" component="p" mt="1px" sx={{ color: 'text.secondary', p:"0" }}>
                                    &#8377; {product.price}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => handleOrderOpen(product)} size="small">Order Now</Button>
                                <Button onClick={() => handleAddToCart(product)} size="small">Add to Cart</Button>
                                <div>
                                    {opneOrder ? orderDialog(product) : <></>}
                                </div>
                            </CardActions>
                        </Card>
                    ) : <></>}
                {isAlert ? loginDialog() : <></>}  
                <div>
                    {opneOrder ? orderDialog() : <></>}
                </div>
            </div> 
            <Snackbar
                anchorOrigin={{vertical : 'top', horizontal: "center"}}
                open={open}
                message={message}
            />
        </div>
    </>
}

export default Home;