import "./Auth.css"

import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { use, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Navbar from "../Navbar";

import Snackbar from '@mui/material/Snackbar';

import axios from "axios";

import { useNavigate } from "react-router-dom";

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function Auth() {

    let [formState, setFormState] = useState(0);    // 0 ->  sign in, 1 -> sign up
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [email, setEmail] = useState(""); 

    const [message, setMessage] = useState();
    const [open, setOpen] = useState(false);

    const [isResponse, setIsResponse] = useState(true);
    let [isLoading, setIsLoading] = useState(false);

    let [error, setError] = useState("");

    let routeTo = useNavigate();

    useEffect(() => {
        setIsLoading(!isResponse);
    }, [isResponse])

    let handleAuthButton = async (e) => {
        e.preventDefault();
        if(formState == 0) {
            setIsResponse(false);
            await client.post("/public/login", {
                "username": username,
                "password": password,
            }).then((response) => {
                localStorage.setItem("token", response.data);
                routeTo("/account");
                setIsResponse(true);
            }).catch((e) => {
                console.log(e);
                setError(e.response.data);
                setIsResponse(true);
            })

        } else {
            setIsResponse(false);
            await client.post("/public/signup", {
                "username": username,
                "password": password,
                "email": email
            }).then((response) => {
                setMessage("Sign Up Succussful. Please Login");
                setOpen(true);
                setTimeout( () => {
                    setOpen(false);
                }, 5000)
                setFormState(0);

                setIsResponse(true);
            }).catch((e) => {
                setError(e.response.data);
                setIsResponse(true);
            })
        }
    }

    useEffect(() => {
        setUsername("");
        setPassword("");
        setEmail("");
        setError("");
    }, [formState])

    return <>
        <Navbar />
        <div className="Signup-conatiner">
        
            <div className="form-div">
                <div className="lockOutIcon">
                    <Avatar sx={{ ml: 40, mb: 3, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                </div>
                <div className="from-state-div" style={{ marginBottom: "30px" }}>
                    
                    <Button variant={formState === 0 ? "contained" : ""} style={{ color: "black" }} onClick={() => { setFormState(0) }}>
                        Sign In
                    </Button>
                    <Button variant={formState === 1 ? "contained" : ""} style={{ color: "black" }} onClick={() => { setFormState(1) }}>
                        Sign Up
                    </Button>
                </div>

    
                <form onSubmit={handleAuthButton}>
                    <div style={{ margin: "20px", width: "90%" }}>
                        <TextField
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Username"
                            fullWidth
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div style={{ margin: "20px", width: "90%" }}>
                        <TextField
                            placeholder="Password"
                            id="password"
                            name="password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {formState == 1 ? (
                        <div style={{ margin: "20px", width: "90%" }}>
                            <TextField
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    ) : (
                        <></>
                    )}

                    <p style={{ color: "red", textAlign: "center" }}>{error}</p>

                    <div style={{ margin: "20px", width: "90%" }}>
                        {!isLoading ?
                            <Button
                                variant="contained"
                                fullWidth
                                type="submit"
                            >
                                {formState == 0 ? "Sign In" : "Sign Up"}
                            </Button>
                            :
                            <Button
                                variant="contained"
                                fullWidth
                                style={{opacity: 0.7}}
                            >
                                Loading..
                            </Button>
                        }

                    </div>
                </form>
            </div>

            <Snackbar
                autoHideDuration={2}
                open={open}
                message={message}
            />
        </div>
    </>
}

export default Auth;