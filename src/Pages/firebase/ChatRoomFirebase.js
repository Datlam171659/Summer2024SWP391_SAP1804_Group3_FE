import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig1 = {
  apiKey: "AIzaSyBfDwDDwNic7C4osCgbiEDHzCqPpPg1jBc",
  authDomain: "instantchat-2b53e.firebaseapp.com",
  projectId: "instantchat-2b53e",
  storageBucket: "instantchat-2b53e.appspot.com",
  messagingSenderId: "329115979212",
  appId: "1:329115979212:web:dde3ad081dedfb58e8a169"
};

const app1 = initializeApp(firebaseConfig1);
export const db = getFirestore(app1);