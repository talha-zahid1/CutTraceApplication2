
import { createContext, useEffect, useState } from "react";
import { setapiaccesstoken } from "../services/auth";

export const model_context = createContext();

export const ApiContext = ({ children }) => {
    const [access_token, setaccess_token] = useState(
        () => localStorage.getItem("access_token") || ""
    );

    useEffect(() => {
        setapiaccesstoken(access_token || null);

        if (access_token) {
            localStorage.setItem("access_token", access_token);
        } else {
            localStorage.removeItem("access_token");
        }
    }, [access_token]);

    return (
        <model_context.Provider value={{ access_token, setaccess_token }}>
            {children}
        </model_context.Provider>
    );
};
