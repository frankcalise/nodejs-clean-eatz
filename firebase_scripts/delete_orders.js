const admin = require("firebase-admin");
const fbConfig = require("../firebase_config.json");
// const firebase = require("firebase");
const serviceAccount = require("../service_account.json");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: fbConfig.databaseURL
});

const deleteSummaryData = orderId => {
  admin
    .database()
    .ref("orders")
    .orderByKey()
    .once("value")
    .then(snapshot => {
      // const order = snapshot.val();
      snapshot.forEach(childSnapshot => {
        const order = childSnapshot.val();
        const orderKey = childSnapshot.key;
        // console.log(orderKey);

        if (orderKey === "2018-11-29") {
          console.log(orderKey);
          admin
            .database()
            .ref(`orders/${orderKey}`)
            .remove();
        }
      });
    });

  admin
    .database()
    .ref("customers")
    .orderByKey()
    .once("value")
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {
        const customer = childSnapshot.val();
        const customerKey = childSnapshot.key;
        const { orders } = customer;
        if (!orders) {
          console.log(customerKey, " has no orders");
        } else {
          const orderKeys = Object.keys(orders);
          orderKeys.forEach(x => {
            if (x === "2018-11-29") {
              const orderPath = `customers/${customerKey}/orders/${x}`;
              admin
                .database()
                .ref(orderPath)
                .remove();
              console.log("remove key @", orderPath);
            }
          });
        }
      });
    });
};

const args = process.argv;
const orderId = args[2];

if (!orderId) {
  console.log("need to provide an order id to delete");
  process.exit(1);
}

deleteSummaryData(orderId);
