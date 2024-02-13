import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCysHUxghsUd_lqe_FO1Gogz3BiWEV6azU",
  authDomain: "procurement-chatbot-2.firebaseapp.com",
  projectId: "procurement-chatbot-2",
  storageBucket: "procurement-chatbot-2.appspot.com",
  messagingSenderId: "397029906644",
  appId: "1:397029906644:web:57236b32785d329556c341",
  measurementId: "G-32NDXYYF9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };