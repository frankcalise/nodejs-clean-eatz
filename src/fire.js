import firebase from "firebase";
const fbConfig = require("./config/firebase_config.json");

const fire = firebase.initializeApp(fbConfig);

export default fire;
