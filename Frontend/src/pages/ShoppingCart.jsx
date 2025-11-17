import Navbar from "../Navbar";
import img from "../assets/PizzaImg.jpeg"

import './ShoppingCart.css'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from "axios";
import { useEffect, useState, useContext } from "react";

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from "react-draggable";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import {useNavigate} from 'react-router-dom'

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});


function ShoppingCart() {

    let [products, setProducts] = useState([]);
    let [isLoading, setIsLoading] = useState(false);

    let [opneOrder, setOpenOrder] = useState(false);
    let [selectedProduct, setSelectedProducts] = useState(null);

    const [addresses, setAddresses] = useState([]);
    const [address, setAddress] = useState('');
    let [isAlert, setIsAlert] = useState(false);

    let router = useNavigate();

    useEffect(() => {
        getData();
    }, [])

    const FoodCard = styled(Card)(({ theme }) => ({
        position: "relative",
        borderRadius: theme.shape.borderRadius * 2,
        overflow: "hidden",
        cursor: "pointer",
        opacity: 1,
        "&:hover .hover-buttons": {
            opacity: 1,
            top: 0,
            transform: "translateY(0)",
        },
    }));

    const HoverButtons = styled(Box)(({ theme }) => ({
        position: "absolute",
        bottom: 0,
        top: -200,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing(2),
        opacity: 0,
        transform: "translateY(30px)",
        transition: "all 0.6s ease",
    }));


    let getData = async () => {
        try {
            setIsLoading(true)
            let response = await client.get("/products/my-cart", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false)
            console.log(response)
            setProducts(() => {
                return [...response.data]
            });
        } catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

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

    let handleOrderPlace = async (product) => {
        if (address.length <= 0) return;
        try {
            let res = client.post("/users/orders/add-order",
                {
                    name: product.name,
                    productId: product.id,
                    totalAmount: product.price,
                    imageUrl: product.imageUrl,
                    address: address
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                }
            )
            setOpenOrder(false);
        } catch (e) {
            console.log(e);
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
                                <Card sx={{ minWidth: 390, maxWidth: 350 }}>
                                    <CardMedia
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
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => handleOrderPlace(selectedProduct)}>ORDER</Button>
                                    </CardActions>
                                </Card>
                            </DialogContent>
                        </Dialog>
                    </React.Fragment >
                    : <></>}
            </>
        )
    }

    let loadingSize = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    let showLoading = () => {
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
        if (window.innerWidth <= 480) {
            router("/new-order", {
                state: product
            })
        } 
        setSelectedProducts(product);
        getAddress();
        setOpenOrder(true);
    }

    let handleOrderClose = () => {
        setOpenOrder(false);
    }

    let handleRemoveBtn = async(product) => {
        try {
            let res = client.delete(`/products/my-cart/remove/${product.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            let filtered = products.filter((p) => p.id != product.id);

            setProducts(() => {
                return [...filtered]
            });
            
        } catch (e) {
            console.log(e);
        }
    }

    return <>
        <Navbar />
        <div className="ShoppingCart-container">
            <div className="items-box">
                {isLoading ? <h1>Loading</h1>
                    : products.length > 0 ?
                        products.map((product, idx) =>
                            <div>
                                <FoodCard className="foodCard">
                                    <Box sx={{ position: "relative" }}>
                                        <CardMedia
                                            className="foodCard-img"
                                            component="img"
                                            image={product.imageUrl}
                                        />
                                        <HoverButtons className="hover-buttons">
                                            <Button onClick={() => handleRemoveBtn(product)} variant="contained" color="error">
                                                Remove
                                            </Button>
                                            <Button onClick={() => handleOrderOpen(product)} variant="contained" color="success">
                                                Order
                                            </Button>
                                        </HoverButtons>
                                    </Box>

                                    <CardContent sx={{ bgcolor: "#fafafa" }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ₹{product.price}
                                        </Typography>
                                    </CardContent>
                                </FoodCard>
                                <div>
                                    {opneOrder ? orderDialog() : <></>}
                                </div>
                            </div>
                        )
                        : <></>}
            </div>
        </div>
    </>
}

export default ShoppingCart;