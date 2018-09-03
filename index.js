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
  .send(formData)

  .end((err, resp) => {
    if (err) {
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
  const monday = today.clone().weekday(1);

  $(".sing-ord").each((idx, item) => {
    // Transaction ID
    const rawTid = $("h4", item);
    const transactionId = parseTransactionId(rawTid);

    // Order Date
    const rawOrderDate = rawTid.next();
    const orderDate = parseOrderDate(rawOrderDate);

    // if (moment(orderDate, "M/D/YYYY h:mm:ss A").isBefore(monday)) {
    //   console.log("skipping ", orderDate);
    //   return true;
    // }

    // Customer Info
    let pIndex = 1;
    const isCleared = $(item).hasClass("cleared-orders");
    if (isCleared === true) {
      pIndex = 2;
    }
    const customerBlock = $("p", item)
      .eq(pIndex)
      .text();
    const ci = parseCustomerInfo(customerBlock);
    const { total, payment, name, email, phone, tip } = ci;

    // Meal details
    const mealNodes = $(".order", item);
    const meals = parseMeals(mealNodes);

    // Order ID
    const orderId = $(".all-order-ids")
      .eq(0)
      .val();

    // Build order object based off parsed results
    orders.push({
      customer: {
        name,
        email,
        phone
      },
      orderId,
      transactionId,
      orderDate,
      total,
      tip,
      payment,
      meals
    });
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
        pairs.email = value.substring(idx + 1).trim();
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
  const summary = {};
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

      const currentMeal = summary[mealName];
      if (currentMeal !== undefined) {
        // let total = summary[mealName].total;
        // total = total === undefined ? mealQty : mealQty + total;
        summary[mealName].total = summary[mealName].total + mealQty;
        summary[mealName].standard = std
          ? summary[mealName].standard + mealQty
          : summary[mealName].standard;
        summary[mealName].extraProtein = ep
          ? summary[mealName].extraProtein + mealQty
          : summary[mealName].extraProtein;
        summary[mealName].glutenFree = gf
          ? summary[mealName].glutenFree + mealQty
          : summary[mealName].glutenFree;
        summary[mealName].halfCarb = hc
          ? summary[mealName].halfCarb + mealQty
          : summary[mealName].halfCarb;
        summary[mealName].noCarb = nc
          ? summary[mealName].noCarb + mealQty
          : summary[mealName].noCarb;
        (summary[mealName].epGf = epGf
          ? summary[mealName].epGf + mealQty
          : summary[mealName].epGf),
          (summary[mealName].epHc = epHc
            ? summary[mealName].epHc + mealQty
            : summary[mealName].epHc),
          (summary[mealName].epNc = epNc
            ? summary[mealName].epNc + mealQty
            : summary[mealName].epNc),
          (summary[mealName].gfHc = gfHc
            ? summary[mealName].gfHc + mealQty
            : summary[mealName].gfHc),
          (summary[mealName].gfNc = gfNc
            ? summary[mealName].gfNc + mealQty
            : summary[mealName].gfNc),
          (summary[mealName].epGfNc = epGfNc
            ? summary[mealName].epGfNc + mealQty
            : summary[mealName].epGfNc),
          (summary[mealName].epGfHc = epGfHc
            ? summary[mealName].epGfHc + mealQty
            : summary[mealName].epGfHc);
      } else {
        summary[mealName] = {
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

  summary.orderCount = orders.length;
  summary.numMeals = numMeals;
  summary.total = Number(total.toFixed(2));
  summary.tips = tips;

  return summary;
};
