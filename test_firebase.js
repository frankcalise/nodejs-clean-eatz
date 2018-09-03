// global.fetch = require("node-fetch");
const fbConfig = require("./firebase_config.json");
const firebase = require("firebase");
// const firebase = require("firebase/firebase-app");
// require("firebase/firebase-database");

const config = {
  apiKey: fbConfig.apiKey,
  authDomain: fbConfig.authDomain,
  databaseURL: fbConfig.databaseURL
};
firebase.initializeApp(config);
const ref = firebase
  .app()
  .database()
  .ref();
ref.once("value").then(snap => {
  console.log("snap.val()", snap.val());
});
