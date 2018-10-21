const admin = require("firebase-admin");
const fbConfig = require("../firebase_config.json");
const serviceAccount = require("../service_account.json");
const fbUtils = require("../utils/firebase_utils");
const fs = require("fs");
const moment = require("moment");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: fbConfig.databaseURL
});

const customersRef = admin.database().ref("customers");
const ordersRef = admin.database().ref("orders");

customersRef.orderByKey().on("child_added", snapshot => {
  const key = snapshot.key;
  const decodedKey = fbUtils.decodeFirebaseKey(key);

  if (decodedKey !== decodedKey.toLowerCase()) {
    console.log(decodedKey);
  }
});
