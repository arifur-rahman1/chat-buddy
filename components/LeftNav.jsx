import React, { useState } from 'react'
import {BiCheck, BiEdit} from "react-icons/bi"
import {FiPlus} from "react-icons/fi"
import {IoClose, IoLogOutOutline} from "react-icons/io5"
import {BsFillCheckCircleFill} from "react-icons/bs"
import {MdPhotoCamera, MdAddAPhoto, MdDeleteForever} from "react-icons/md"
import Avater from './Avater'
import { useAuth } from '@/context/authContext'
import Icon from './Icon'
import { profileColors } from '@/utils/constants'
import {toast } from 'react-toastify';
import ToastMessage from '@/components/ToastMessage'
import { doc, updateDoc } from 'firebase/firestore'
import { db,auth } from '@/firebase/firebase'
import { updateProfile } from 'firebase/auth'


const LeftNav = () => {

  const [editProfile, setEditProfile]=useState(true);
  const [nameEdited, setNameEdited]=useState(false);
    const {currentUser, signOut,setCurrentuser}=useAuth();

    const authUser=auth.currentUser;
    const handleUpdateProfile=(type,value)=>{
      let obj= {...currentUser}
      switch (type) {
        case "color":
          obj.color=value;
          break;
          case "name":
          obj.displayName=value;
          break;
          case "photo":
            obj.photoURL=value;
            break;
            case "photo-remove":
          obj.photoURL=null;
          break;
        default:
          break;
      }
      try {
        toast.promise(async()=>{
          const userDocRef= doc(db,"users",currentUser.uid)
        await updateDoc(userDocRef,obj)
        setCurrentuser(obj)
        if(type==="photo-remove"){
          await updateProfile(authUser,{photoURL:null})
        }
        if(type==="name"){
          await updateProfile(authUser,{displayName:value})
          setNameEdited(false);
        }

        },{
            pending: 'Updating profile',
          success: 'profile updated successfully',
           error: 'Profile update failed'
        },{
            autoclose:3000
        })
    } catch (error) {
        console.error(error);
    }
    }

    const onkeyup=(event)=>{ 
      if(event.target.innerText.trim() !== currentUser.displayName){
        //name is edited
        setNameEdited(true)
      }else{
        //name is not edited
        setNameEdited(false)
      }
    } 
    const onkeydown=(event)=>{
      if(event.key ==="Enter" && event.keyCode === 13){
        event.preventDefault();
      }
    } 


    const editProfileContainer =()=>{
      return (
        <div className='relative flex flex-col items-center'>
          <ToastMessage/>
          <Icon 
          size="small"
          className="absolute top-0 right-5 hover:bg-c2"
          icon={<IoClose size={20}/>}
          onClick={()=>setEditProfile(false)}
          />
          <div className='relative group cursor-pointer'>
          <Avater size="xx-large" user={currentUser}/>
          <div className='w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex '>
            {/* profile avater icon added code */}
            <label htmlFor='fileUpload'>
            {currentUser.photoURL ? ( <MdPhotoCamera size={34}/>) :
             ( <MdAddAPhoto size={34}/>)}
            </label>
           <input
           id='fileUpload'
           type="file"
           onChange={(e)=>{}}
           style={{display:"none"}}
           />
           
           
          </div>
          {currentUser.photoURL && (<div className='w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0'>
            <MdDeleteForever size={14}/>
          </div>)}
          </div>
          <div className='mt-5 flex flex-col items-center'>
          <div className='flex items-center gap-2'>
            {!nameEdited && <BiEdit className='text-c3'/>}
            {nameEdited && (<BsFillCheckCircleFill className='text-c4 cursor-pointer'
            onClick={()=>{
              handleUpdateProfile("name",document.getElementById('displayNameEdit').innerText)
            }}
            />)}
              <div contentEditable
               className='bg-transparent outline-none border-none text-center'
              id='displayNameEdit'
              onKeyUp={onkeyup}
              onKeyDown={onkeydown}
              >{currentUser.displayName}</div>
          </div>
          <span className='text-c3 text-sm'>{currentUser.email}</span>
          </div>
         <div className='grid grid-cols-5 gap-4 mt-5'>
            {profileColors.map((colors,index)=>(
              <span key={index} className='w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125' style={{backgroundColor:colors}}>
              {colors===currentUser.color && (  <BiCheck size={24}/>)}
              </span>
            ))}
         </div>
        </div>
      )
    }

  return (
    <div className={`${editProfile ? "w-[350px]" : "w-[80px] items-center"}
     flex flex-col justify-between py-5 shrink-0 transition-all`}>
      {editProfile ? editProfileContainer() : ( <div className='relative group cursor-pointer' 
       onClick={()=>setEditProfile(true)} >
           <Avater size="large" user={currentUser}/>
            <div className='w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex'>
                <BiEdit size={14}/>
            </div>
        </div>) }
       
        <div className={`flex gap-5  ${editProfile ? "ml-5" : "flex-col items-center" }`}>
            <Icon
            size="x-large"
            className="bg-green-500 hover:bg-gray-600 "
            icon={<FiPlus size={24}/>}
            onClick={()=>{}}
            />
             <Icon
            size="x-large"
            className="hover:bg-c2 "
            icon={<IoLogOutOutline size={24}/>}
            onClick={signOut}
            
            />

        </div>
    </div>
  )
}

export default LeftNav