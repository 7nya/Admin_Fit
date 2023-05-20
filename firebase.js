import { initializeApp } from "firebase/app";

import {getAuth} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe24MAg7yOkvfPEZK9Gfg9dlZSi2XTbyw",
  authDomain: "adminfit.firebaseapp.com",
  databaseURL: "https://adminfit-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "adminfit",
  storageBucket: "adminfit.appspot.com",
  messagingSenderId: "923441335220",
  appId: "1:923441335220:web:12d3e3e0609051fd1080e1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const storage = getStorage(app);

//export const storageAvatar = firebase.storage();

export const createUserDocument = async (instructor, additionalData) => {
  if (!instructor) return

  // Получение ссылки на документ пользователя
  const userRef = doc(firestore, `instructors/${instructor.uid}`);

  // Проверка наличия документа пользователя в Firestore
  const snapshot = await getDoc(userRef);

  if(snapshot.exists) {
    const {email} = instructor;
    const {username} = additionalData;
    try{
      // Создание документа пользователя
      await setDoc(
        userRef,
        {
          email,
          username,
          gender,
          age,
          isCoach,
          description,
          avatar
        }
      )
      console.log('succes')
    } catch(err) {
      console.log('got error: ', err.message)
    }
  }
}

firebase.initializeApp(firebaseConfig);

export {firebase};