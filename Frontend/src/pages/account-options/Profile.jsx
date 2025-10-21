import './Profile.css'

import WithAuth from '../../utils/withAuth';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileComponent() {

    let [user, setUser] = useState({username: "", password: "", email: ""});
    let router = useNavigate();

    useEffect(() => { 
        let getData = async() => {
            let response = await axios.get("http://localhost:8080/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                console.log(response.data.username)
                setUser(() => {
                    return {username: response.data.username, password: response.data.password, email: response.data.email}
                });
            }
        }
        getData();
    }, [])

    let handleSignOut = () => {
        localStorage.clear();
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
                        <b>{user.username}</b>
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