const fbConfig = require("../firebase_config.json");
const fbUtils = require("../utils/firebase_utils");
const firebase = require("firebase");
const fs = require("fs");
const moment = require("moment");

const config = {
  apiKey: fbConfig.apiKey,
  authDomain: fbConfig.authDomain,
  databaseURL: fbConfig.databaseURL
};
firebase.initializeApp(config);

const checkCustomerExistsByKey = key => {
  return firebase
    .database()
    .ref("customers/" + key)
    .once("value")
    .then(function(snapshot) {
      return snapshot.exists();
    });
};

const writeCustomerData = (
  key,
  name,
  email,
  phone,
  lastOrderId,
  orderDate,
  lastTransactionId
) => {
  firebase
    .database()
    .ref("customers/" + key)
    .set({
      name: name,
      email: email,
      phone: phone,
      lastOrderDate: moment(orderDate).format(),
      lastOrderId,
      lastTransactionId
    });
};

const updateLastOrderData = (
  key,
  lastOrderId,
  orderDate,
  lastTransactionId
) => {
  firebase
    .database()
    .ref("customers/" + key)
    .update({
      lastOrderDate: moment(orderDate).format(),
      lastOrderId,
      lastTransactionId
    });
};

const writeOrderData = (item, customerKey) => {
  const {
    orderId,
    transactionId,
    orderDate,
    promocode,
    discount,
    payment,
    total,
    meals
  } = item;

  firebase
    .database()
    .ref(`orders/${orderId}/${transactionId}`)
    .set({
      customerKey,
      orderDate: moment(orderDate).format(),
      promocode: promocode || "",
      discount: discount || "$0.00",
      total,
      payment,
      meals
    });
};

const args = process.argv;
const ordersFile = args[2];

if (fs.existsSync(ordersFile) === false) {
  // exit with error
  console.log("file path not found");
  process.exit(1);
}

const orders = JSON.parse(fs.readFileSync(ordersFile, "utf8"));

if (!orders) {
  console.log("error parsing orders from file", ordersFile);
  process.exit(1);
}

orders.forEach(item => {
  const customer = item.customer;
  const customerKey = fbUtils.encodeAsFirebaseKey(customer.email);

  const { orderId, orderDate, transactionId } = item;

  checkCustomerExistsByKey(customerKey).then(exists => {
    console.log(exists);
    if (exists === false) {
      writeCustomerData(
        customerKey,
        customer.name,
        customer.email,
        customer.phone,
        orderId,
        orderDate,
        transactionId
      );
    } else {
      // update last order date / id and transaction
      updateLastOrderData(customerKey, orderId, orderDate, transactionId);
    }

    // add the order details
    writeOrderData(item, customerKey);
  });
});

// console.log("finished adding customers");

// free resources
// firebase.app().delete();
