const fbConfig = require("../firebase_config.json");
const firebase = require("firebase");
const moment = require("moment");

firebase.initializeApp(fbConfig);

const daysSinceLastOrder = 30;

firebase
  .database()
  .ref("customers")
  .orderByKey()
  .once("value")
  .then(snapshot => {
    const missedOrders = [];

    snapshot.forEach(childSnapshot => {
      const customer = childSnapshot.val();
      const customerKey = childSnapshot.key;

      const { name, lastOrderDate } = customer;
      const momentRef = moment(lastOrderDate);
      const timeAgo = moment()
        .subtract(daysSinceLastOrder, "days")
        .startOf("day");

      if (momentRef.isAfter(timeAgo) === false) {
        missedOrders.push({
          name,
          lastOrderDate: momentRef.format("MM/DD/YYYY")
        });
      }
    });

    console.log(
      `${
        missedOrders.length
      } customers haven't ordered in ${daysSinceLastOrder} days`
    );
    missedOrders.forEach(x => {
      console.log(`${x.name}, ${x.lastOrderDate}`);
    });
  });
