// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPmrKPKNwoGbg69M7X9Q8URodAvktFOxc",
  authDomain: "fueltrix-b50cf.firebaseapp.com",
  projectId: "fueltrix-b50cf",
  storageBucket: "fueltrix-b50cf.appspot.com",
  messagingSenderId: "506416948090",
  appId: "1:506416948090:web:894cfbaa18d2295a896cc3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app)

