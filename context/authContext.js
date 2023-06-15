import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {createContext, useContext, useEffect, useState } from "react"

const UserContext=createContext();

export const UserProvider =({children})=>{
    const [currentUser,setCurrentuser]=useState(null);
    const [isLoading,setIsloading]=useState(true);

    const clear=()=>{
        setCurrentuser(null)
        setIsloading(false)
    }

    const authStateChanged=(user)=>{
        setIsloading(true);
        if (!user) {
            clear()
            return;
        }
        setCurrentuser(user)
        setIsloading(false)
    }

    useEffect(()=>{
        const unsubscribe= onAuthStateChanged(auth,authStateChanged);
        return()=>unsubscribe();
    },[])

    return(
        <UserContext.Provider value={{currentUser,setCurrentuser,isLoading,setIsloading}}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth=()=>useContext(UserContext);