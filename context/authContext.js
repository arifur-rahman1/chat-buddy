import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {createContext, useContext, useEffect, useState } from "react"

const UserContext=createContext();

export const UserProvider =({children})=>{
    const [currentUser,setCurrentuser]=useState(null);
    const [isLoading,setIsloading]=useState(true);

    const clear=()=>{
        setCurrentuser(null)
        setIsloading(false)
    }

    const authStateChanged= async (user)=>{
        setIsloading(true);
        if (!user) {
            clear()
            return;
        }

     const userDoc = await getDoc (doc(db,"users",user.uid))

        setCurrentuser(userDoc.data());
        setIsloading(false)
    }

    const signOut=()=>{
        authSignOut(auth).then(()=>clear())
    }

    useEffect(()=>{
        const unsubscribe= onAuthStateChanged(auth,authStateChanged);
        return()=>unsubscribe();
    },[])

    return(
        <UserContext.Provider value={{currentUser,setCurrentuser,isLoading,setIsloading,signOut}}>
            {children}
        </UserContext.Provider>
    )
}

export const useAuth=()=>useContext(UserContext);