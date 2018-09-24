const moment = require("moment");
const firebase = require("firebase");
const fbConfig = require("../firebase_config.json");

firebase.initializeApp(fbConfig);
const root = firebase.database().ref();
const customerRef = root.child("customers");

const today = moment();
let adjWeek = 0;
if (today.weekday() < 4) {
  adjWeek = -7;
}
const menuDate = moment()
  .day(adjWeek)
  .weekday(4)
  .startOf("day");

console.log(
  "finding first time customers for menu date:",
  menuDate.format("YYYY-MM-DD")
);

customerRef
  .orderByChild("firstOrderDate")
  .startAt(menuDate.valueOf())
  .once("value")
  .then(snapshot => {
    const customer = snapshot.val();
    console.log(customer);
  });

// customerRef
//   .orderByKey()
//   .once("value")
//   .then(snapshot => {
//     snapshot.forEach(childSnapshot => {
//       const customer = childSnapshot.val();
//       const customerKey = childSnapshot.key;
//       if (customer.firstOrderDate !== undefined) {
//         const firstOrderDate = moment(customer.firstOrderDate).valueOf();

//         // firebase
//         //   .database()
//         //   .ref(`customers/${customerKey}`)
//         //   .update({ firstOrderDate });
//       }
//     });
//   });
