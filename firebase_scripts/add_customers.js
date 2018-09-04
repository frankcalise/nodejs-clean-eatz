const fbConfig = require("../firebase_config.json");
const firebase = require("firebase");
const fs = require("fs");

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

const checkCustomerExists = name => {
  const found = firebase
    .database()
    .ref("customers/")
    .orderByChild("name")
    .equalTo(name);
  return found ? true : false;
};

const writeCustomerData = (name, email, phone) => {
  firebase
    .database()
    .ref("customers/")
    .push({
      name,
      email,
      phone
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
  console.log(customer.name);
  if (checkCustomerExists(customer.name)) {
    writeCustomerData(customer.name, customer.email, customer.phone);
  }
});
