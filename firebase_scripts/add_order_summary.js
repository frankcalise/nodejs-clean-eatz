const fbConfig = require("../firebase_config.json");
const firebase = require("firebase");
const fs = require("fs");
const moment = require("moment");

firebase.initializeApp(fbConfig);

const writeSummaryData = (summary, orderId) => {
  const { orderCount, numMeals, total, tips } = summary;

  firebase
    .database()
    .ref(`orderSummaries/${orderId}`)
    .set({
      orderCount,
      numMeals,
      total,
      tips
    });
};

const args = process.argv;
const summaryFile = args[2];
const orderId = args[3];

if (fs.existsSync(summaryFile) === false) {
  // exit with error
  console.log("file path not found");
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryFile, "utf8"));

if (!summary) {
  console.log("error parsing orders from file", summaryFile);
  process.exit(1);
}

writeSummaryData(summary, orderId);
