const fbConfig = require("../firebase_config.json");
const firebase = require("firebase");
const moment = require("moment");

firebase.initializeApp(fbConfig);

const orderKey = "70537";
const startDate = "2018-08-01";
const endDate = "2018-08-31";

const start = moment(startDate).startOf("day");
const end = moment(endDate).endOf("day");

const meals = [
  "Arnold in a Bowl",
  "Chicken Fajita",
  "Ham & Cheese Omelette",
  "Keto Chicken",
  "Mashed Potato Bowl",
  "Meatlovers Pizza Pasta"
];

async function getName(key) {
  let returnVal = await firebase
    .database()
    .ref(`customers/${order.customerKey}/name`)
    .once("value")
    .then(snapshot => {
      const name = snapshot.val();

      return name;
    });

  return returnVal;
}

async function main() {
  let satelliteGroups = {};

  const arr = [];
  let satelliteOrders = await firebase
    .database()
    .ref(`orders/${orderKey}`)
    .orderByChild("satellite")
    .equalTo(true)
    .once("value")
    .then(async snapshot => {
      snapshot.forEach(childSnapshot => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;

        arr.push(item);
      });

      return arr;
      // const order = snapshot.val();
      // order.key = snapshot.key;

      // // const name = await getName(order.customerKey);
      // // console.log(name);

      // return order;
    });

  // console.log(satelliteOrders);
  // const arr = [];
  // satelliteOrders.forEach(snapshot => {
  //   const item = childSnapshot.val();
  //   item.key = childSnapshot.key;

  //   arr.push(item);
  // });

  // console.log(arr);

  // const satelliteGroups = satelliteOrders.map(x => {
  //   console.log(x);
  // });

  arr.forEach(x => {
    const order = x;

    const { satellitePickUp, customerKey } = order;

    const meal0 = order.meals.find(x => x.name === meals[0]);
    const meal1 = order.meals.find(x => x.name === meals[1]);
    const meal2 = order.meals.find(x => x.name === meals[2]);
    const meal3 = order.meals.find(x => x.name === meals[3]);
    const meal4 = order.meals.find(x => x.name === meals[4]);
    const meal5 = order.meals.find(x => x.name === meals[5]);

    let customerMeals = {
      [meals[0]]: meal0 ? meal0.qty : 0,
      [meals[1]]: meal1 ? meal1.qty : 0,
      [meals[2]]: meal2 ? meal2.qty : 0,
      [meals[3]]: meal3 ? meal3.qty : 0,
      [meals[4]]: meal4 ? meal4.qty : 0,
      [meals[5]]: meal5 ? meal5.qty : 0
    };

    const item = { customerKey, meals: customerMeals };

    if (satelliteGroups[satellitePickUp] === undefined) {
      satelliteGroups[satellitePickUp] = [item];
    } else {
      satelliteGroups[satellitePickUp].push(item);
    }
  });

  console.log(satelliteGroups);
}
main();
