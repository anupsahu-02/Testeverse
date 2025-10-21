
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({});

const client = axios.create({
    baseURL: `http://localhost:8080`
});

function UserProvider({ children }) {

    const userContext = useContext(UserContext);

    let [user, setUser] = useState(null);

    let [isTokenValid, setIsTokenValid] = useState(false);
 
    const isValidToken = async () => {
        try {
            let res = await client.get(`/public/validate-token/${localStorage.getItem("token")}`);
            setIsTokenValid(true);
            return res.status;
        } catch(e) {
            setIsTokenValid(false);
            throw e;
        }
    }

    useEffect(() => {
        if(isTokenValid) {
            getUser();
        } else {
            setUser(null);
        }
    }, [isTokenValid]);

    const getUser = async () => {
        try {
            let res = await client.get(`/public/get-user/${localStorage.getItem("token")}`);
            console.log(res.data)
            setUser(res.data);
        } catch (e) {
            setUser(null);
            throw e;
        }
    }

    const data = {
        isValidToken, user
    };

    return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}

export default UserProvider;