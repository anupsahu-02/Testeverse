import './Profile.css'

import WithAuth from '../../utils/WithAuth';
import { UserContext } from '../../contexts/UserContext';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function ProfileComponent() {

    let [user, setUser] = useState({username: "", password: "", email: ""});
    let router = useNavigate();

    let { setRestaurant, getUser, setAction } = useOutletContext();
    let {currUser, setCurrUser} = useContext(UserContext);

    useEffect(() => {
        if (currUser) {
            setUser({
                username: currUser.username,
                password: currUser.password,
                email: currUser.email
            });
        }
    }, [currUser]); // runs whenever currUser changes

    let handleSignOut = () => {
        localStorage.clear();
        setCurrUser(null);
        router("/")
    }

    return <>
        <div className="ProfileComponent-container"> 
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="p" component="p">
                        <b>Your Account</b>
                    </Typography>
                    <Typography style={{ fontSize: "large" }} variant="body2" sx={{ color: 'text.secondary' }}>
                        Username
                    </Typography>
                    <Typography variant="p" component="p" mt="1px" sx={{ color: 'text.secondary' }}>
                        <b>{user.username.substring(0, user.username.indexOf("@gmail.com") > -1 ? user.username.indexOf("@gmail.com") : user.username.length)}</b>
                    </Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography style={{ fontSize: "large" }} variant="body2" sx={{ color: 'text.secondary' }}>
                        Email
                    </Typography>
                    <Typography variant="p" component="p" mt="1px" sx={{ color: 'text.secondary' }}>
                        <b>{user.email}</b>
                    </Typography>
                </CardContent>
                <Typography variant="p" component="p" borderTop={"1px solid black"} mt="1px" p={2} sx={{ color: 'text.secondary' }}>
                    <span onClick={handleSignOut} style={{ color: "red", cursor: "pointer" }}>Sign Out</span>
                </Typography>
            </Card>
        </div>
    </>
}

export default ProfileComponent;