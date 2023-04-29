// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe24MAg7yOkvfPEZK9Gfg9dlZSi2XTbyw",
  authDomain: "adminfit.firebaseapp.com",
  projectId: "adminfit",
  storageBucket: "adminfit.appspot.com",
  messagingSenderId: "923441335220",
  appId: "1:923441335220:web:12d3e3e0609051fd1080e1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {auth}
