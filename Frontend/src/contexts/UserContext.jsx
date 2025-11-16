
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({});

const backendURL = `${import.meta.env.VITE_API_URL}`;

const client = axios.create({
    baseURL: backendURL
});

function UserProvider({ children }) {

    const userContext = useContext(UserContext);

    let [currUser, setCurrUser] = useState(null);

    let [isTokenValid, setIsTokenValid] = useState(false);
 
    const isValidToken = async () => {
        try {
            let res = await client.get(`/public/validate-token/${localStorage.getItem("token")}`);
            setIsTokenValid(true);
            return res.status;
        } catch(e) {
            setCurrUser(null);
            setIsTokenValid(false);
            throw e;
        }
    }

    useEffect(() => {
        if(!isTokenValid) {
            setCurrUser(null);
        }
    }, [isTokenValid]);

    const getUser = async () => {
        try {
            let res = await client.get(`/public/get-user/${localStorage.getItem("token")}`);
            console.log(res.data)
            setCurrUser(res.data);
        } catch (e) {
            setCurrUser(null);
            throw e;
        }
    }

    const data = {
        isValidToken, setCurrUser, currUser
    };

    return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}

export default UserProvider;