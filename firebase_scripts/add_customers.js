const admin = require("firebase-admin");
const fbConfig = require("../firebase_config.json");
const serviceAccount = require("../service_account.json");
const fbUtils = require("../utils/firebase_utils");
// const firebase = require("firebase");
const fs = require("fs");
const moment = require("moment");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: fbConfig.databaseURL
});

const checkCustomerExistsByKey = key => {
  return admin
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
  admin
    .database()
    .ref("customers/" + key)
    .set({
      name: name,
      email: email,
      phone: phone,
      firstOrderDate: moment(orderDate).valueOf(),
      firstOrderId: lastOrderId,
      firstTransactionId: lastTransactionId,
      lastOrderDate: moment(orderDate).format(),
      lastOrderId,
      lastTransactionId
    });

  updateOrdersForCustomer(key, lastOrderId, lastTransactionId);
};

const updateLastOrderData = (
  key,
  lastOrderId,
  orderDate,
  lastTransactionId
) => {
  admin
    .database()
    .ref("customers/" + key)
    .update({
      lastOrderDate: moment(orderDate).format(),
      lastOrderId,
      lastTransactionId
    });
};

const updateOrdersForCustomer = (key, orderId, transactionId) => {
  admin
    .database()
    .ref(`customers/${key}/orders/${orderId}`)
    .set(transactionId);
  // .ref(`customers/${key}/orders`)
  // .remove();
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
    meals,
    tip,
    satellitePickUp,
    menuDate
  } = item;

  admin
    .database()
    .ref(`orders/${menuDate}/${transactionId}`)
    .set({
      customerKey,
      orderDate: moment(orderDate).format(),
      promocode: promocode || "",
      discount: discount ? Number(discount.substring(1)) : 0.0,
      tip: tip ? Number(tip.substring(1)) : 0.0,
      total: Number(total.substring(1)),
      payment,
      meals,
      satellite: satellitePickUp ? true : false,
      satellitePickUp: satellitePickUp ? satellitePickUp : null
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
  console.log(item);
  const customer = item.customer;
  const customerKey = fbUtils.encodeAsFirebaseKey(customer.email.toLowerCase());

  const { orderId, orderDate, transactionId, orders, menuDate } = item;

  checkCustomerExistsByKey(customerKey).then(exists => {
    console.log(exists);
    if (exists === false) {
      writeCustomerData(
        customerKey,
        customer.name,
        customer.email,
        customer.phone,
        menuDate,
        orderDate,
        transactionId
      );
    } else {
      // update last order date / id and transaction
      updateLastOrderData(customerKey, menuDate, orderDate, transactionId);
      updateOrdersForCustomer(customerKey, menuDate, transactionId);
    }

    // add the order details
    writeOrderData(item, customerKey);
  });
});

// console.log("finished adding customers");

// free resources
// firebase.app().delete();
