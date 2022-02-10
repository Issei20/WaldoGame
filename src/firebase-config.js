import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBssDqS9PKuvjsCjKu0F9QgFoSmfhZJxrc",
  authDomain: "waldooo-4eb02.firebaseapp.com",
  projectId: "waldooo-4eb02",
  storageBucket: "waldooo-4eb02.appspot.com",
  messagingSenderId: "764524572136",
  appId: "1:764524572136:web:193ecab933ae64dbc7885d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);