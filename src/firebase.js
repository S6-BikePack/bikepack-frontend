import {initializeApp} from 'firebase/app'

import {
    GoogleAuthProvider,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import {useLocation, Navigate, useNavigate} from "react-router-dom";
import {createContext, useContext, useEffect, useState} from "react";
import {useRecoilValue} from "recoil";

const firebaseConfig = {
    apiKey: "AIzaSyDqR8feB5849W4DcKgjLCHvDoF1NcJa8S8",
    authDomain: "bikepack-d6503.firebaseapp.com",
    projectId: "bikepack-d6503",
    storageBucket: "bikepack-d6503.appspot.com",
    messagingSenderId: "500658123913",
    appId: "1:500658123913:web:b75ed5f0d0b7cadffbc258",
    measurementId: "G-7WVCJP6LT7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginWithEmailPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        throw err
    }
};

const registerWithEmailAndPassword = async (email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        console.log(user)
    } catch (err) {
        throw err
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    loginWithEmailPassword,
    registerWithEmailAndPassword,
    logout,
};