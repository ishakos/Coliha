import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmapcJw0wzmjLrIokIz-9PLk7aqsxm-Ko",
  authDomain: "e-com-dav.firebaseapp.com",
  projectId: "e-com-dav",
  storageBucket: "e-com-dav.appspot.com",
  messagingSenderId: "118788884916",
  appId: "1:118788884916:web:0af6c33a39002ead204ae1",
  measurementId: "G-FK3C3Y1DED",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
