import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
const fbConfig = require("./firebase_config.json");

firebase.initializeApp(fbConfig);
const Auth = firebase.auth();

export default firebase;
const db = firebase.database();
const customersRef = db.ref("customers");
const orderSummariesRef = db.ref("orderSummaries");
const ordersRef = db.ref("orders");
const mealsByMenuDateRef = db.ref("mealsByMenuDate");
const notesRef = db.ref("notes");

export {
  Auth,
  orderSummariesRef,
  customersRef,
  ordersRef,
  mealsByMenuDateRef,
  notesRef
};
