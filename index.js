const creds = require("./credentials.json");
const request = require("superagent");
const cheerio = require("cheerio");
const moment = require("moment");
const fs = require("fs");
const agent = request.agent();
const formData = {
  username: creds.username,
  password: creds.password,
  sendto: "/"
};

agent
  .post("https://www.cleaneatz.com/loginout.aspx")
  .redirects(0)
  .send(formData)
  .end((err, resp) => {
    if (err && err.status === 302) {
    } else if (err) {
      throw err;
    }
  });

agent
  .get("https://www.cleaneatz.com/admin-store-orders/id/3556885")
  .end((err, resp) => {
    if (err) {
      throw err;
    }

    parseOrders(resp.text);
  });

const parseOrders = body => {
  const orders = [];
  const $ = cheerio.load(body);
  const today = moment();
  let adjWeek = 0;
  if (today.weekday() < 4) {
    adjWeek = -7;
  }
  const thursday = today
    .clone()
    .days(adjWeek)
    .weekday(4)
    .startOf("day");

  $(".sing-ord").each((idx, item) => {
    // Satellite order check
    const isSatellite = $("p", item).hasClass("alert-danger");

    // Transaction ID
    const rawTid = $("h4", item);
    const transactionId = parseTransactionId(rawTid);

    // Order Date
    const rawOrderDate = rawTid.next();
    const orderDate = parseOrderDate(rawOrderDate);

    if (moment(orderDate, "M/D/YYYY h:mm:ss A").isBefore(thursday)) {
      console.log("skipping ", orderDate);
      return true;
    }

    // Customer Info
    let pIndex = 1;
    const isCleared = $(item).hasClass("cleared-orders");
    if (isCleared === true) {
      pIndex = 2;
    }

    // Check for satellite pick up alert
    if (transactionId === "029932") {
      console.log(
        $("p", item)
          .eq(pIndex)
          .text()
      );
    }

    let satellitePickUp = null;
    if (isSatellite) {
      console.log("sat pick up");
      // satellite pick up

      let satellitePickUpNode = $("p", item).eq(0);
      if (satellitePickUpNode.text().indexOf("BEEN COMPLETED") >= 0) {
        satellitePickUpNode = $("p", item).eq(1);
        pIndex = 3;
      } else {
        // change index for proper customer parsing
        pIndex = 2;
      }
      satellitePickUp = parseSatellitePickUp(satellitePickUpNode);
    }

    const customerBlock = $("p", item)
      .eq(pIndex)
      .text();
    const ci = parseCustomerInfo(customerBlock);
    const { total, payment, name, email, phone, tip, discount, promocode } = ci;

    // Meal details
    const mealNodes = $(".order", item);
    const meals = parseMeals(mealNodes);

    // Order ID
    const orderId = $(".all-order-ids")
      .eq(0)
      .val();

    // Build order object based off parsed results
    const order = {
      customer: {
        name,
        email,
        phone
      },
      orderId,
      transactionId,
      orderDate,
      discount,
      promocode,
      total,
      tip,
      payment,
      meals
    };
    if (satellitePickUp) {
      order.satellitePickUp = satellitePickUp;
    }
    orders.push(order);
  });

  // Query for meal names to make things easier
  const summary = summarizeOrders(orders);
  fs.writeFile("meals_summary.json", JSON.stringify(summary), "utf8");
  fs.writeFile("orders.json", JSON.stringify(orders), "utf8");
};

const parseTransactionId = node => {
  const cleaned = node.text().trim();
  const idx = cleaned.indexOf(":");
  return cleaned.substring(idx + 1).trim();
};

const parseSatellitePickUp = node => {
  const cleaned = node.text().trim();
  const idx = cleaned.indexOf(":");
  return cleaned.substring(idx + 1).trim();
};

const parseOrderDate = node => {
  const cleaned = node.text().trim();
  const idx = cleaned.indexOf(":");
  return cleaned.substring(idx + 1).trim();
};

const parseSemiKeyValue = text => {
  const idx = text.indexOf(":");
  const key = text
    .substring(0, idx)
    .trim()
    .toLowerCase();
  const value = text.substring(idx + 1).trim();
  const item = { key, value };

  return item;
};

const parseCustomerInfo = text => {
  const pairs = {};
  const lines = text.split("\n");

  lines.forEach(item => {
    const cleaned = item.trim();
    if (cleaned.length > 0) {
      const kvp = parseSemiKeyValue(cleaned);
      if (kvp.key === "customer") {
        const value = kvp.value;
        // Get the email from the Name, Email line
        const idx = value.indexOf(",");
        pairs.name = value.substring(0, idx);
        pairs.email = value
          .substring(idx + 1)
          .trim()
          .toLowerCase();
      } else {
        pairs[kvp.key] = kvp.value;
      }
    }
  });

  return pairs;
};

const parseMeals = nodes => {
  const meals = [];
  nodes.each((idx, item) => {
    const attribs = item.attribs;
    const extraProtein = attribs["data-ep"] === "true";
    const halfCarb = attribs["data-hc"] === "true";
    const noCarb = attribs["data-nc"] === "true";
    const glutenFree = attribs["data-gf"] === "true";
    const isSpecial = extraProtein || halfCarb || noCarb || glutenFree;

    const meal = {
      name: attribs["data-name"],
      qty: Number.parseInt(attribs["data-qty"]),
      extraProtein,
      halfCarb,
      noCarb,
      glutenFree,
      isSpecial
    };

    meals.push(meal);
  });

  return meals;
};

const parseCurrency = currency => {
  if (currency) {
    return Number(currency.replace(/[^0-9\.-]+/g, ""));
  }

  return 0.0;
};

const summarizeOrders = orders => {
  const summary = { meals: {} };
  const today = moment();
  let adjWeek = 0;
  if (today.weekday() < 4) {
    adjWeek = -7;
  }
  const menuDate = moment()
    .day(adjWeek)
    .weekday(4)
    .startOf("day")
    .format("YYYY-MM-DD");
  let numMeals = 0;
  let total = 0.0;
  let tips = 0.0;
  orders.forEach(item => {
    total += parseCurrency(item.total);
    tips += parseCurrency(item.tip);

    item.meals.forEach(meal => {
      numMeals += meal.qty;
      const mealName = meal.name;
      const mealQty = meal.qty;
      const std =
        !meal.extraProtein &&
        !meal.halfCarb &&
        !meal.noCarb &&
        !meal.glutenFree;
      const ep =
        meal.extraProtein && !meal.halfCarb && !meal.noCarb && !meal.glutenFree;
      const hc =
        !meal.extraProtein && meal.halfCarb && !meal.noCarb && !meal.glutenFree;
      const nc =
        !meal.extraProtein && !meal.halfCarb && meal.noCarb && !meal.glutenFree;
      const gf =
        !meal.extraProtein && !meal.halfCarb && !meal.noCarb && meal.glutenFree;
      const epGf =
        meal.extraProtein && !meal.halfCarb && !meal.noCarb && meal.glutenFree;
      const epHc =
        meal.extraProtein && meal.halfCarb && !meal.noCarb && !meal.glutenFree;
      const epNc =
        meal.extraProtein && !meal.halfCarb && meal.noCarb && !meal.glutenFree;
      const gfHc =
        !meal.extraProtein && meal.halfCarb && !meal.noCarb && meal.glutenFree;
      const gfNc =
        !meal.extraProtein && !meal.halfCarb && meal.noCarb && meal.glutenFree;
      const epGfHc =
        meal.extraProtein && meal.halfCarb && !meal.noCarb && meal.glutenFree;
      const epGfNc =
        meal.extraProtein && !meal.halfCarb && meal.noCarb && meal.glutenFree;

      const currentMeal = summary.meals[mealName];
      if (currentMeal !== undefined) {
        // let total = summary[mealName].total;
        // total = total === undefined ? mealQty : mealQty + total;
        summary.meals[mealName].total = summary.meals[mealName].total + mealQty;
        summary.meals[mealName].standard = std
          ? summary.meals[mealName].standard + mealQty
          : summary.meals[mealName].standard;
        summary.meals[mealName].extraProtein = ep
          ? summary.meals[mealName].extraProtein + mealQty
          : summary.meals[mealName].extraProtein;
        summary.meals[mealName].glutenFree = gf
          ? summary.meals[mealName].glutenFree + mealQty
          : summary.meals[mealName].glutenFree;
        summary.meals[mealName].halfCarb = hc
          ? summary.meals[mealName].halfCarb + mealQty
          : summary.meals[mealName].halfCarb;
        summary.meals[mealName].noCarb = nc
          ? summary.meals[mealName].noCarb + mealQty
          : summary.meals[mealName].noCarb;
        (summary.meals[mealName].epGf = epGf
          ? summary.meals[mealName].epGf + mealQty
          : summary.meals[mealName].epGf),
          (summary.meals[mealName].epHc = epHc
            ? summary.meals[mealName].epHc + mealQty
            : summary.meals[mealName].epHc),
          (summary.meals[mealName].epNc = epNc
            ? summary.meals[mealName].epNc + mealQty
            : summary.meals[mealName].epNc),
          (summary.meals[mealName].gfHc = gfHc
            ? summary.meals[mealName].gfHc + mealQty
            : summary.meals[mealName].gfHc),
          (summary.meals[mealName].gfNc = gfNc
            ? summary.meals[mealName].gfNc + mealQty
            : summary.meals[mealName].gfNc),
          (summary.meals[mealName].epGfNc = epGfNc
            ? summary.meals[mealName].epGfNc + mealQty
            : summary.meals[mealName].epGfNc),
          (summary.meals[mealName].epGfHc = epGfHc
            ? summary.meals[mealName].epGfHc + mealQty
            : summary.meals[mealName].epGfHc);
      } else {
        summary.meals[mealName] = {
          total: mealQty,
          standard: std ? mealQty : 0,
          extraProtein: ep ? mealQty : 0,
          glutenFree: gf ? mealQty : 0,
          halfCarb: hc ? mealQty : 0,
          noCarb: nc ? mealQty : 0,
          epGf: epGf ? mealQty : 0,
          epHc: epHc ? mealQty : 0,
          epNc: epNc ? mealQty : 0,
          gfHc: gfHc ? mealQty : 0,
          gfNc: gfNc ? mealQty : 0,
          epGfNc: epGfNc ? mealQty : 0,
          epGfHc: epGfHc ? mealQty : 0
        };
      }
    });
  });

  summary.menuDate = menuDate;
  summary.orderCount = orders.length;
  summary.numMeals = numMeals;
  summary.total = Number(total.toFixed(2));
  summary.tips = tips;

  return summary;
};
