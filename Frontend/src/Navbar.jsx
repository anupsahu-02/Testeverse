import "./Navbar.css"

import IconButton from "@mui/material/IconButton";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LunchDiningIcon from '@mui/icons-material/LunchDining';

import { UserContext } from './contexts/UserContext'

function Navbar() {

    let [isLogin, setIsLogin] = useState(false);

    let currentUrl = window.location.href;

    let isLoginPage = currentUrl.indexOf("/login");
    let isSignupPage = currentUrl.indexOf("/signup");

    let router = useNavigate();

    let { isValidToken } = useContext(UserContext);

    useEffect(() => {
        validate();
    }, [])

    let validate = async () => {
        let token = localStorage.getItem("token");
        if (token) {
            try {
                await isValidToken(token);
                setIsLogin(true);
            } catch (e) {
                localStorage.removeItem("token");
                setIsLogin(false);
            }
        }
    }

    return ( 
       <div className="Nav-container">
            <div className="left-nav">
                <span className="testeverse" onClick={(() => router("/"))}>
                    Testeverse
                </span>
            </div>
            <div className="search-box">
                <div>
                    <div>
                        <input type="text" placeholder='Search.. "Food"' class="form-control" id="search" />
                    </div>
                    
                </div>
            </div>
            <div className="right-nav">
               {isLoginPage == -1 && isSignupPage == -1 ? 
                    <>

                        {isLogin ?

                            <>
                                <IconButton onClick={(() => router("/my-cart"))}>
                                    <ShoppingCartIcon />
                                </IconButton>

                                <IconButton onClick={(() => router("/account/profile"))}>
                                    <AccountCircleIcon />
                                </IconButton>
                            </>
                            
                            :
                            <>
                                <Link  style={{textDecoration: "none"}} to={"/auth"}>Login</Link>
                            </>
                        }   
                    </>
                : <></> }
            </div>
       </div>
    )
}

export default Navbar;