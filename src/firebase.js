import {initializeApp} from 'firebase/app'

import {
    GoogleAuthProvider,
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import {
    getFirestore,
    collection,
    addDoc,
} from "firebase/firestore";

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

export const loginWithEmailPassword = async (email, password) => new Promise(async resolve => {
        {
            try {
                if (auth.currentUser)
                    resolve(auth.currentUser)
                else
                    await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                        resolve(userCredential.user);
                    })
            } catch (err) {
                console.log(err);
                alert(err.message);
            }
        }
    }
)

export const isAuthenticated = () => {
    console.log(auth.currentUser)
    return auth.currentUser !== undefined
};

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        console.log(user)
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};