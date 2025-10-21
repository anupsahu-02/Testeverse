
import './Account.css'

import WithAuth from '../utils/withAuth';

import Navbar from '../Navbar';
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";


function Account() {

    let [isSeller, setIsSeller] = useState(false);
    let [activeComponent, setActiveComponet] = useState();

    let router = useNavigate();

    useEffect(() => {
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
                            <span>Product Configurations </span>
                            <br />
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
                        <p style={{ color: activeComponent == "seller-register" ? "black" : "blue" }} onClick={(() => {
                            // setActiveComponet("seller-register");
                            // router("/account/seller-register");
                            setIsSeller(true);
                        })}>Sell on Testeverse</p>

                    }

                </div>
                <div className="active-component">
                    <Outlet />
                </div>
            </div>
        </div>
    </>
}

export default WithAuth(Account);