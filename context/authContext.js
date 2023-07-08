import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {createContext, useContext, useEffect, useState } from "react"

const UserContext=createContext();

export const UserProvider =({children})=>{
    const [currentUser,setCurrentuser]=useState(null);
    const [isLoading,setIsloading]=useState(true);

    const clear= async()=>{
        try {
            // if user log out 
            if (currentUser) {
                await updateDoc(doc(db,"users",currentUser.uid),{
                    isOnline:false
                })
            }
            setCurrentuser(null)
        setIsloading(false)
        } catch (error) {
            console.error(error)
        }
        
    }

    const authStateChanged= async (user)=>{
        setIsloading(true);
        if (!user) {
            clear()
            return;
        }
        // logic for user active or not
        const userDocExist=await getDoc(doc(db,"users",user.uid))
        if (userDocExist.exists()) {
            await updateDoc(doc(db,"users",user.uid),{
                isOnline:true
            })
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