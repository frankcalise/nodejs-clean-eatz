const firebase = require("firebase");
const fbConfig = require("../firebase_config.json");

firebase.initializeApp(fbConfig);
const root = firebase.database().ref();
const customerRef = root.child("customers");

const args = process.argv;
const searchText = args[2];

customerRef
  .orderByChild("name")
  .startAt(searchText)
  .endAt(searchText + "\uf8ff")
  .once("value")
  .then(snapshot => {
    console.log(snapshot.val());
  });
