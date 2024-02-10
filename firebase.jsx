// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD89rOU2RtKVQWv9wrAafIhfqrCDyQClkE",
  authDomain: "castwave.firebaseapp.com",
  projectId: "castwave",
  storageBucket: "castwave.appspot.com",
  messagingSenderId: "921073743398",
  appId: "1:921073743398:web:835d2350782da05e3f18e7",
  measurementId: "G-5JJKT69HH0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
