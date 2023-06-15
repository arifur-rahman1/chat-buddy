// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getStorage} from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBhrpkCfvaQ87Yc-wZPJ9WlL2xxuxQbC5Q",
  authDomain: "chat-buddy-f315f.firebaseapp.com",
  projectId: "chat-buddy-f315f",
  storageBucket: "chat-buddy-f315f.appspot.com",
  messagingSenderId: "260542335876",
  appId: "1:260542335876:web:599f7adc53dda2d2fd2bd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const storage=getStorage(app);
export const db=getFirestore(app);