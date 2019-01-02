const {
  lstatSync,
  readdirSync,
  readFileSync,
  createWriteStream
} = require("fs");
const { join } = require("path");

const source = "C:\\Users\\fcalise\\Documents\\clean_eatz_orders";

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const dirs = getDirectories(source);
const logger = createWriteStream(`${source}\\cynergy_customers.txt`);

dirs.map(dir => {
  const ordersFile = `${dir}\\orders.json`;
  const orders = JSON.parse(readFileSync(ordersFile, "utf8"));
  const satelliteOrders = orders.filter(x => x.satellitePickUp);
  const menuDate = orders[0].menuDate;
  logger.write(`Menu Date of ${menuDate}\r\n`);
  logger.write(`========================\r\n`);
  satelliteOrders.map(order => {
    const { name, email } = order.customer;
    const { satellitePickUp } = order;

    if (satellitePickUp.indexOf("Cynergy") >= 0) {
      logger.write(`${email}\r\n`);
    }
  });
  logger.write("\r\n");
  console.log(menuDate, ", num sat orders = ", satelliteOrders.length);
});

logger.end();
