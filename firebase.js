import { initializeApp } from "firebase/app";

import {getAuth} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';

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
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);




export const createUserDocument = async (instructor, additionalData) => {
  if (!instructor) return

  // Получение ссылки на документ пользователя
  const userRef = doc(firestore, `instructors/${instructor.uid}`);

  // Проверка наличия документа пользователя в Firestore
  const snapshot = await getDoc(userRef);

  if(snapshot.exists) {
    const {email} = instructor;
    const {name} = additionalData;
    try{
      // Создание документа пользователя
      await setDoc(
        userRef,
        {
          email,
          name,
        }
      )
      console.log('succes')
    } catch(err) {
      console.log('got error: ', err.message)
    }
  }
}