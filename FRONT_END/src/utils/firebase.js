import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBhW8qClNAl-N0rmoWkMMjgRkn8XlR8I54",
  authDomain: "niki-quan-ao.firebaseapp.com",
  databaseURL: "https://niki-quan-ao-default-rtdb.firebaseio.com",
  projectId: "niki-quan-ao",
  storageBucket: "niki-quan-ao.appspot.com",
  messagingSenderId: "607913834253",
  appId: "1:607913834253:web:1c6abe0eac9e0a17a6e244",
  measurementId: "G-X8HTW7TQNM",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
export const authentication = getAuth(initializeApp(firebaseConfig));
