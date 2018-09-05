const fbConfig = require("../firebase_config.json");
const fbUtils = require("../utils/firebase_utils");
const firebase = require("firebase");
const fs = require("fs");

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

const writeCustomerData = (key, name, email, phone) => {
  firebase
    .database()
    .ref("customers/" + key)
    .set({
      name: name,
      email: email,
      phone: phone
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

  checkCustomerExistsByKey(customerKey).then(exists => {
    console.log(exists);
    if (exists === false) {
      writeCustomerData(
        customerKey,
        customer.name,
        customer.email,
        customer.phone
      );
    }
  });
});

// console.log("finished adding customers");

// free resources
// firebase.app().delete();
