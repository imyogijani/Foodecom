// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNBplIKMtXjzaHjSg1HzF1JST60XYTh7g",
  authDomain: "ecom-emall-world.firebaseapp.com",
  projectId: "ecom-emall-world",
  messagingSenderId: "422412652929",
  appId: "1:422412652929:web:eeb1d855719ba22cd4d880",
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const auth = getAuth(firebaseApp);

export { messaging };

export { auth, createUserWithEmailAndPassword, sendEmailVerification };
