// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmmoBVG7WagUNUA2e7QXCJJwGoM5afKDw",
  authDomain: "iot-smart-home-f76bb.firebaseapp.com",
  projectId: "iot-smart-home-f76bb",
  storageBucket: "iot-smart-home-f76bb.appspot.com",
  messagingSenderId: "446675947168",
  appId: "1:446675947168:web:ef7af5eac05f42ab2143c5",
  measurementId: "G-35G5JNBJ13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);