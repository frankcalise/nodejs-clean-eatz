const firebase = require("firebase");
const fbConfig = require("../firebase_config.json");

firebase.initializeApp(fbConfig);
const root = firebase.database().ref();
const customerRef = root.child("mealsByMenuDate");

const args = process.argv;
const searchText = args[2];

customerRef
  .orderByKey()
  .startAt(searchText)
  .endAt(searchText + "\uf8ff")
  .once("value")
  .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      const key = childSnapshot.key;
      console.log(key);
    });
    // console.log(snapshot.val());
  });
