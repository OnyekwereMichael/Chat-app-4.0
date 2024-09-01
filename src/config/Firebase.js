import { initializeApp, } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { toast } from 'react-toastify'

const firebaseConfig = {
    apiKey: "AIzaSyDyCmFr7FeTIvzCSx9WPZa7UoEWAmUU5h0",
    authDomain: "chat-app-c0ec8.firebaseapp.com",
    projectId: "chat-app-c0ec8",
    storageBucket: "chat-app-c0ec8.appspot.com",
    messagingSenderId: "961414136365",
    appId: "1:961414136365:web:6208f79b511ce7de6d6ea4"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const signUp = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name: '',
            avatar:'',
            Bio: 'Hey, There i am using chat app',
            lastSeen: Date.now(),
        })

        await setDoc(doc(db, 'chat', user.uid), {
            chatsData: []
        })

        toast.success("Account created successfully!");
    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}

const Login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        toast.success("Login successful!");
    } catch (error) {
        console.error(error)
        toast.error(error.code)
    }
}

const logOut = async () => {
    try {
        await signOut(auth)
        toast.success("Logout successful!");        
    } catch (error) {
        console.log(error)
        toast.error(error.code)
    }

}
export { signUp, Login, logOut, auth, db }