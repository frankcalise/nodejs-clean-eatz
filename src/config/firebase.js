import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
const fbConfig = require("./firebase_config.json");

firebase.initializeApp(fbConfig);
const Auth = firebase.auth();

export default firebase;
const db = firebase.database();
const orderSummariesRef = db.ref("orderSummaries");
export { Auth, orderSummariesRef };
