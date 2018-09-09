const fbConfig = require("../firebase_config.json");
const firebase = require("firebase");
const fs = require("fs");

firebase.initializeApp(fbConfig);

const deleteSummaryData = orderId => {
  firebase
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

        if (orderKey.startsWith("7")) {
          console.log(orderKey);
          // firebase
          //   .database()
          //   .ref(`orders/${orderKey}`)
          //   .remove();
        }
      });
    });

  firebase
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
          console.log(customerKey);
        }
        const orderKeys = Object.keys(orders);
        orderKeys.forEach(x => {
          if (x.startsWith("7")) {
            const orderPath = `customers/${customerKey}/orders/${x}`;
            // firebase
            //   .database()
            //   .ref(orderPath)
            //   .remove();
            console.log("remove key @", orderPath);
          }
        });
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
