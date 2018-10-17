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

const checkCustomerExistsByKey = key => {
  return admin
    .database()
    .ref("customers/" + key)
    .once("value")
    .then(snapshot => {
      return snapshot.exists();
    });
};

const getCustomerByKey = key => {
  console.log("find customer with key:", key);
  return customersRef
    .child(key)
    .once("value")
    .then(snapshot => {
      const customer = snapshot.val();
      return customer;
    });
};

const args = process.argv;
const primaryKey = fbUtils.encodeAsFirebaseKey(args[2]);
let secondaryKey = args[3];

async function main() {
  // if secondaryKey doesn't exist, just move primaryKey record to this
  // otherwise move primaryKey to secondaryKey with mergers
  const primaryCustomer = await getCustomerByKey(primaryKey);
  let secondaryCustomer = null;
  if (secondaryKey) {
    secondaryKey = fbUtils.encodeAsFirebaseKey(secondaryKey);
    const exists = await checkCustomerExistsByKey(secondaryKey);
    if (exists === true) {
      secondaryCustomer = await getCustomerByKey(secondaryKey);
    }
  }

  if (secondaryCustomer) {
    console.log(secondaryCustomer.name);
    // do comparisons
  } else {
    console.log("just move primary");
    const lowerKey = fbUtils.encodeAsFirebaseKey(primaryKey.toLowerCase());
    console.log("to key", lowerKey);
    console.log(primaryCustomer);
    console.log("switch orders from primary key");
    const orderKeys = Object.keys(primaryCustomer.orders);
    const orderUpdates = orderKeys.map(orderKey => {
      const transactionKey = primaryCustomer.orders[orderKey];
      return `orders/${orderKey}/${transactionKey}/customerKey`;
    });
    // foreach primaryCustomer.orders
    console.log(orderUpdates);
    // /orders/orderKey/transactionKey/customerKey
    // update to lowerKey
    console.log("remove customer at primaryKey");
    // customersRef.child(lowerKey).set(primaryCustomer);
  }
}

main();
