const fbConfig = require("./firebase_config.json");
const firebase = require("firebase");

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
