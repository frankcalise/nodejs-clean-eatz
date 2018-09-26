const fbConfig = require("../firebase_config.json");
const firebase = require("firebase");
const fs = require("fs");
const fbUtils = require("../utils/firebase_utils");
const moment = require("moment");

firebase.initializeApp(fbConfig);

const checkMealNameExists = key => {
  return firebase
    .database()
    .ref("mealsByMenuDate/" + key)
    .once("value")
    .then(function(snapshot) {
      return snapshot.exists();
    });
};

const writeMealCount = summary => {
  const { meals, menuDate } = summary;
  const keys = Object.keys(meals);

  keys.forEach(key => {
    const encodedKey = fbUtils.encodeAsFirebaseKey(key);
    const meal = meals[key];
    const count = meal.total;

    if (checkMealNameExists(encodedKey)) {
      // update
      firebase
        .database()
        .ref(`mealsByMenuDate/${encodedKey}`)
        .update({ [menuDate]: count });
    } else {
      // add
      firebase
        .database()
        .ref(`mealsByMenuDate/${encodedKey}`)
        .set({ [menuDate]: count });
    }
  });
};

const args = process.argv;
const summaryFile = args[2];

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

writeMealCount(summary);
