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

const checkCustomerExistsByKey = key => {
  const encodedKey = fbUtils.encodeAsFirebaseKey(key);
  return admin
    .database()
    .ref("customers/" + encodedKey)
    .once("value")
    .then(snapshot => {
      return snapshot.exists();
    });
};

const getCustomerByKey = key => {
  const encodedKey = fbUtils.encodeAsFirebaseKey(key);
  console.log("find customer with key:", encodedKey);
  return customersRef
    .child(encodedKey)
    .once("value")
    .then(snapshot => {
      const customer = snapshot.val();
      return customer;
    });
};

const args = process.argv;
const primaryKey = args[2];
let secondaryKey = args[3];
const mergedKey = args[4];

async function main() {
  // if secondaryKey doesn't exist, just move primaryKey record to this
  // otherwise move primaryKey to secondaryKey with mergers
  const primaryCustomer = await getCustomerByKey(primaryKey);
  let secondaryCustomer = null;
  if (secondaryKey) {
    // secondaryKey = fbUtils.encodeAsFirebaseKey(secondaryKey);
    const exists = await checkCustomerExistsByKey(secondaryKey);
    if (exists === true) {
      secondaryCustomer = await getCustomerByKey(secondaryKey);
    }
  }

  if (secondaryCustomer) {
    console.log(secondaryCustomer.name);
    // do comparisons
    // first and last order

    const combinedOrders = {
      ...primaryCustomer.orders,
      ...secondaryCustomer.orders
    };

    // merge first order datetime
    let firstOrderData = {
      firstOrderDate: null,
      firstOrderId: null,
      firstTransactionId: null
    };

    if (primaryCustomer.firstOrderDate && secondaryCustomer.firstOrderDate) {
      // check which is earlier
      if (primaryCustomer.firstOrderDate < secondaryCustomer.firstOrderDate) {
        firstOrderData.firstOrderDate = primaryCustomer.firstOrderDate;
        firstOrderData.firstOrderId = primaryCustomer.firstOrderId;
        firstOrderData.firstTransactionId = primaryCustomer.firstTransactionId;
      } else {
        firstOrderData.firstOrderDate = secondaryCustomer.firstOrderDate;
        firstOrderData.firstOrderId = secondaryCustomer.firstOrderId;
        firstOrderData.firstTransactionId =
          secondaryCustomer.firstTransactionId;
      }
    } else if (
      primaryCustomer.firstOrderDate &&
      !secondaryCustomer.firstOrderDate
    ) {
      firstOrderData.firstOrderDate = primaryCustomer.firstOrderDate;
      firstOrderData.firstOrderId = primaryCustomer.firstOrderId;
      firstOrderData.firstTransactionId = primaryCustomer.firstTransactionId;
    } else if (
      !primaryCustomer.firstOrderDate &&
      secondaryCustomer.firstOrderDate
    ) {
      firstOrderData.firstOrderDate = secondaryCustomer.firstOrderDate;
      firstOrderData.firstOrderId = secondaryCustomer.firstOrderId;
      firstOrderData.firstTransactionId = secondaryCustomer.firstTransactionId;
    } else {
      // don't have the info
      console.log("no first date info");
      console.log(primaryCustomer.firstOrderDate);
      console.log(secondaryCustomer.firstOrderDate);
    }

    // merge last order datetime
    let lastOrderData = {
      lastOrderDate: null,
      lastOrderId: null,
      lastTransactionId: null
    };
    const primaryLastOrderDate = moment(
      primaryCustomer.lastOrderDate
    ).valueOf();
    const secondaryLastOrderDate = moment(
      secondaryCustomer.lastOrderDate
    ).valueOf();
    if (primaryLastOrderDate > secondaryLastOrderDate) {
      lastOrderData.lastOrderDate = primaryCustomer.lastOrderDate;
      lastOrderData.lastOrderId = primaryCustomer.lastOrderId;
      lastOrderData.lastTransactionId = primaryCustomer.lastTransactionId;
    } else {
      lastOrderData.lastOrderDate = secondaryCustomer.lastOrderDate;
      lastOrderData.lastOrderId = secondaryCustomer.lastOrderId;
      lastOrderData.lastTransactionId = secondaryCustomer.lastTransactionId;
    }

    const combinedCustomer = {
      ...primaryCustomer,
      email: primaryCustomer.email.toLowerCase(),
      orders: combinedOrders,
      ...firstOrderData,
      ...lastOrderData
    };

    console.log(combinedCustomer);
    const lowerKey = fbUtils.encodeAsFirebaseKey(mergedKey.toLowerCase());

    const orderUpdates = Object.keys(combinedCustomer.orders).map(orderKey => {
      const transactionKey = combinedCustomer.orders[orderKey];
      return `${orderKey}/${transactionKey}`;
    });
    // foreach primaryCustomer.orders
    console.log(orderUpdates);
    orderUpdates.forEach(orderPath => {
      ordersRef.child(orderPath).update({ customerKey: lowerKey });
    });

    console.log("merged key", lowerKey);

    const encodedPrimaryKey = fbUtils.encodeAsFirebaseKey(primaryKey);
    const encodedSecondaryKey = fbUtils.encodeAsFirebaseKey(secondaryKey);
    customersRef.child(encodedPrimaryKey).remove();
    customersRef.child(encodedSecondaryKey).remove();

    customersRef.child(lowerKey).set(combinedCustomer);
  } else {
    console.log("just move primary");
    const lowerKey = fbUtils.encodeAsFirebaseKey(
      (secondaryKey || primaryKey).toLowerCase()
    );
    console.log("to key", lowerKey);
    console.log(primaryCustomer);
    console.log("switch orders from primary key");
    const orderKeys = Object.keys(primaryCustomer.orders);
    const orderUpdates = orderKeys.map(orderKey => {
      const transactionKey = primaryCustomer.orders[orderKey];
      return `${orderKey}/${transactionKey}`;
    });
    // foreach primaryCustomer.orders
    console.log(orderUpdates);
    orderUpdates.forEach(orderPath => {
      //ordersRef.child(orderPath).update({ customerKey: lowerKey })
    });
    // /orders/orderKey/transactionKey/customerKey
    // update to lowerKey
    console.log("remove customer at primaryKey");
    // customersRef.child(lowerKey).set(primaryCustomer);
    const newProps = {
      ...primaryCustomer,
      email: secondaryKey.toLowerCase()
    };
    console.log(newProps);

    // customersRef.child(primaryKey).remove();
  }
}

main();
