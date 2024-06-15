import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDDA20dJQM-FELGdiJGsbWRi5NRnifgroE",
    authDomain: "chatworld-907c3.firebaseapp.com",
    databaseURL: "https://chatworld-907c3-default-rtdb.firebaseio.com",
    projectId: "chatworld-907c3",
    storageBucket: "chatworld-907c3.appspot.com",
    messagingSenderId: "301017954728",
    appId: "1:301017954728:web:308cfeedf160de5f37c59d",
    timeoutMs: 30000,
};


if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};