import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyB6pqZ3XhHhD_yKLIQDe6nDOtumr36Lah8",
  authDomain: "tesla-238517.firebaseapp.com",
  databaseURL: "https://tesla-238517.firebaseio.com",
  projectId: "tesla-238517",
  storageBucket: "tesla-238517.appspot.com",
  messagingSenderId: "997741409825",
  appId: "1:997741409825:web:a9bbccd632f2a625"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default { firebase };
