
import './Account.css'

import WithAuth from '../utils/WithAuth';

import Navbar from '../Navbar';
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState, useContext } from "react";
import axios from 'axios';

import Snackbar from '@mui/material/Snackbar';

import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';

import LinearProgress from '@mui/material/LinearProgress';
import { UserContext } from '../contexts/UserContext';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function Account() {

    let [isSeller, setIsSeller] = useState(false);
    let [activeComponent, setActiveComponet] = useState();
    let [loading, setLoading] = useState(true);
    let [open, setOpen] = useState(false);
    let [message, setMassage] = useState("");

    let [restaurant, setRestaurant] = useState("");

    let {currUser, setCurrUser} = useContext(UserContext);

    let router = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    let [action, setAction] = useState(false);

    useEffect(() => {
        if(!currUser || action) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        return 0;
                    }
                    const diff = Math.random() * 20;
                    let np = Math.min(oldProgress + diff, 100);
                    if (!loading) {
                        setAction(false)
                        return 100
                    } else {
                        if (np === 100) return 90;
                    }
                    return np;
                });
            }, 500);

            return () => {
                clearInterval(timer);
            };
        }
    }, []);

    let showMessage = (message, res_name) => {
        setOpen(true);
        setMassage(message);
        setRestaurant(res_name);
        setTimeout(() => {
            setOpen(false);
            setMassage("");
        }, 5000)
    }

    let getUser = async () => {
        try {
            setLoading(true);
            let response = await client.get("/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setCurrUser(response.data);
            setIsSeller(response.data.seller);
            if (response.data.seller) {
                setRestaurant(response.data.restaurant.restaurant_name);
            }
            setLoading(false);
            setProgress(0);
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        try {
            if(!currUser && currUser == null) {
                getUser();
            } else {
                setIsSeller(currUser.seller);
                if (currUser.seller) {
                    setRestaurant(currUser.restaurant.restaurant_name);
                }
            }
        } catch (e) {
            console.log(e)
        }
    }, [currUser])

    useEffect(() => {
        let currentUrl = window.location.href;
        if (currentUrl.substring(currentUrl.indexOf("account")) === "account" && !loading) {
            setActiveComponet("profile");
            router(`/account/profile`);
        } 
    }, [loading])

    const toggleDrawer = (newOpen) => () => {
        setDrawerOpen(newOpen);
    };

    const DrawerList = (
        <Box className="drawer-box" role="presentation" onClick={toggleDrawer(false)}>
            <List>
                {['profile', 'orders', 'my-address'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => {
                            setActiveComponet({ text });
                            router(`/account/${text}`);
                        }}>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            {isSeller ? 
                <List>
                    <span style={{ fontFamily: "cursive", color: "rebeccapurple", fontSize: "medium", paddingLeft: "20px" }}>{restaurant}</span>
                    {['dashboard', 'add-item', 'my-items'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => {
                                setActiveComponet({ text });
                                router(`/account/${text}`);
                            }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            :
                <List>
                    {['Become a Seller'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton onClick={() => {
                                setActiveComponet("seller-config-form");
                                router("/account/seller-config-form");
                            }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            }
        </Box>
    )

    return <>
        <div>
            <Navbar />
            <div className="Account-container">
                <div className='other-progress-bar'>
                    {(loading && !currUser) || action ?
                        <Box sx={{ width: '100vw', position: "absolute" }}>
                            <LinearProgress variant="determinate" value={progress} />
                        </Box> : <></>}
                </div>
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
                    <div className="drawer-open-box">
                        {(loading && !currUser) || action ?
                            <Box sx={{ width: '100vw', position: "absolute" }}>
                                <LinearProgress variant="determinate" value={progress} />
                            </Box> : <></>}
                        {!currUser ? <></> : <Button className='drawer-open-icon' onClick={toggleDrawer(true)}><MenuOpenRoundedIcon /></Button>}
                        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
                            <div>
                                {DrawerList}
                            </div>
                        </Drawer>
                    </div>
                    <div className='phone-progress-bar'>
                    </div>
                    <Outlet context={{showMessage, setRestaurant, getUser, currUser, setAction }} />
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