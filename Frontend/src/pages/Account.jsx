
import './Account.css'

import WithAuth from '../utils/withAuth';

import Navbar from '../Navbar';
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from 'axios';

import Snackbar from '@mui/material/Snackbar';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function Account() {

    let [isSeller, setIsSeller] = useState(false);
    let [activeComponent, setActiveComponet] = useState();

    let [open, setOpen] = useState(false);
    let [message, setMassage] = useState("");

    let [restaurant, setRestaurant] = useState("");

    let router = useNavigate();

    let seller = async() => {
        try {
            let response = await client.get("/users/isSeller", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setIsSeller(response.data);
        } catch(e) {
            console.log(e);
        }
    }

    let showMessage = (message, res_name) => {
        setOpen(true);
        setMassage(message);
        setRestaurant(res_name);
        setTimeout(() => {
            setOpen(false);
            setMassage("");
        }, 5000)
    }

    useEffect(() => {
        seller();
        setActiveComponet("profile");
        router("/account/profile");
    }, [])

    return <>
        <div>
            <Navbar />
            <div className="Account-container">
                <div className="AccountPanel">
                    <h3 style={{ margin: "10px 0 20px 0" }}>Your Account</h3>
                    <p style={{ color: activeComponent == "profile" ? "black" : "blue" }} onClick={(() => {
                        setActiveComponet("profile");
                        router("/account/profile");
                    })}> Profile </p>
                    <p style={{ color: activeComponent == "orders" ? "black" : "blue" }} onClick={(() => {
                        setActiveComponet("orders");
                        router("/account/orders");
                    })}>Orders</p>
                    <p style={{ color: activeComponent == "my-address" ? "black" : "blue" }} onClick={(() => {
                        setActiveComponet("my-address");
                        router("/account/my-address");
                    })}>My Address</p>

                    <div style={{borderTop: "1px solid wheat", margin: "5px 0 20px 0"}}>

                    </div>
                    {isSeller ? 
                    <>  
                        <span style={{fontFamily: "cursive", color: "rebeccapurple", fontSize: "large"}}>{restaurant}</span>
                        <br />
                        <p style={{ color: activeComponent == "dashboard" ? "black" : "blue" }} onClick={(() => {
                            setActiveComponet("dashboard");
                            router("/account/dashboard");
                        })}>Dashboard</p>
                        <p style={{ color: activeComponent == "add-item" ? "black" : "blue" }} onClick={(() => {
                            setActiveComponet("add-item");
                            router("/account/add-item");
                        })}>Add Food</p>
                        <p style={{ color: activeComponent == "my-items" ? "black" : "blue" }} onClick={(() => {
                            setActiveComponet("my-items");
                            router("/account/my-items");
                        })}>My Items</p>
                    </>
                    : 
                        <p style={{ color: activeComponent == "seller-config-form" ? "black" : "blue" }} onClick={() => {
                            setActiveComponet("seller-config-form");
                            router("/account/seller-config-form");
                        }}>Become a Seller</p>
                    }

                </div>
                <div className="active-component">
                    <Outlet context={{ seller, showMessage, setRestaurant }} />
                </div>
            </div>
            <Snackbar
                autoHideDuration={2}
                open={open}
                message={message}
            />
        </div>
    </>
}

export default WithAuth(Account);