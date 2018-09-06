const fbConfig = require("../firebase_config.json");
const firebase = require("firebase");
const moment = require("moment");

firebase.initializeApp(fbConfig);

const startDate = "2018-08-01";
const endDate = "2018-08-31";

const start = moment(startDate).startOf("day");
const end = moment(endDate).endOf("day");

firebase
  .database()
  .ref("orders")
  .orderByKey()
  .once("value")
  .then(snapshot => {
    let reportTotal = 0.0;
    let tipTotal = 0.0;
    let discountTotal = 0.0;
    let orderCount = 0;
    let payCash = 0;
    let payCredit = 0;

    snapshot.forEach(childSnapshot => {
      // const orders = childSnapshot.val();
      const orderKey = childSnapshot.key;

      childSnapshot.forEach(orderSnapshot => {
        const transactionKey = orderSnapshot.key;
        const order = orderSnapshot.val();

        const { total, tip, orderDate, discount, payment } = order;

        // check if the order date is between the range before
        // appending to report totals
        const orderMoment = moment(orderDate);
        if (start.isBefore(orderMoment) && end.isAfter(orderMoment)) {
          // console.log("between!", orderMoment.format("MM/DD/YYYY"));
          const isCash = payment.indexOf("cash") > -1;
          orderCount += 1;
          reportTotal += total;
          tipTotal += tip;
          discountTotal += discount;
          if (isCash) {
            payCash += 1;
          } else {
            payCredit += 1;
          }
        }
      });
    });

    console.log(
      `number of orders = ${orderCount} (cash: ${payCash}, credit: ${payCredit})`
    );
    console.log("total =", reportTotal.toFixed(2));
    console.log("tips =", tipTotal.toFixed(2));
    console.log("discounts given =", discountTotal.toFixed(2));
  });
