import { api } from "../services/auth";
import { createContext, useCallback, useEffect, useState } from "react";
import { setapiaccesstoken } from "../services/auth";

export const model_context = createContext();

export const ApiContext = ({ children }) => {
    const [access_token, setaccess_token] = useState(
        () => localStorage.getItem("access_token") || ""
    );
    const [role, setrole] = useState("")
    const fetch_user=useCallback(async()=>{
        try {
            const resp=await api.get('profile_api/')
            if (resp?.data?.status==false) {
                throw new Error(
                    resp?.data?.message ||"couldn't fetch the profile "
                )
            }
            setrole(resp?.data?.data?.role)
        } catch (error) {
            console.error(error)
        }
    },[])
    useEffect(()=>{
        fetch_user()
    },[fetch_user])
    
    useEffect(() => {
        setapiaccesstoken(access_token || null);

        if (access_token) {
            localStorage.setItem("access_token", access_token);
        } else {
            localStorage.removeItem("access_token");
        }
    }, [access_token]);

    return (
        <model_context.Provider value={{ access_token, setaccess_token,role,setrole }}>
            {children}
        </model_context.Provider>
    );
};
