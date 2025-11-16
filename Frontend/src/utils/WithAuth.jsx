import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function WithAuth(WrappedComponenet) {
    const AuthComponent = (props) => {
        let [isLoading, setIsLoading] = useState(true);
        let [isUserAuthenticated, setisUserAuthenticated] = useState(false); 
        let { isValidToken, setCurrUser } = useContext(UserContext)

        let router = useNavigate(); 

        const isAuthenticated = async (token) => {
            try {
                await isValidToken(token);
                return true;
            } catch(e) {
                return false;
            }
        }

        useEffect(() => {
            let validate = async() => {
                let token = localStorage.getItem("token");
                if(token) {
                    let authenticated = await isAuthenticated(token);

                    if (authenticated) {
                        setisUserAuthenticated(true);
                    } else {
                        setCurrUser(null);
                        localStorage.clear();
                        router("/auth");
                    }
                } else {
                    router('/auth')
                }

                setIsLoading(false);
            }
            validate();
        }, [router, isAuthenticated])
        
        if(isLoading) {
            return <>
                <div>LOADING...</div>
            </>
        }

        if(isUserAuthenticated) {
            return <WrappedComponenet {...props}/>
        }

        router("/auth")

        return null;

    } 
    return AuthComponent;
}
export default WithAuth;