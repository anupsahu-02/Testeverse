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
import { useEffect, useState } from "react";

function ShoppingCart() {

    let [product, setProduct] = useState(null);
    let [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getData();
    }, [])

    let getData = async () => {
        try {
            setIsLoading(true)
            let response = await axios.get("http://localhost:8080/products/my-cart", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsLoading(false)
            setProduct(response.data);
        } catch (e) {
            setIsLoading(false)
            console.log(e)
        }
    }

    let handleOrder = (product) => {
        
        // try {
        //     axios.post("http://localhost:8080/orders/add-order", {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem("token")}`
        //         }
        //     })
        // }

    }

    return <>
        <Navbar />
        <div className="ShoppingCart-container">
            {isLoading ? <h1>Loading</h1>
            : product != null ?
                <div>
                    <Card sx={{ minWidth: 550, maxWidth: 550, maxHeight: 500 }}>
                        <CardMedia
                            sx={{ height: 250 }}
                            image={product.imageUrl}
                            title="Product Image"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="p" component="p">
                                <b>{product.name}</b>
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>

                            </Typography>
                            <Typography variant="p" component="p" mt="1px" sx={{ color: 'text.secondary' }}>
                                &#8377; {product.price}
                            </Typography>
                        </CardContent>
                        <CardActions style={{marginLeft: "40%"}} >
                            <Button onClick={handleOrder} variant="contained" size="larger">Order..</Button>
                        </CardActions>
                    </Card>
                </div>
            : <></>}
        </div>
    </>
}

export default ShoppingCart;