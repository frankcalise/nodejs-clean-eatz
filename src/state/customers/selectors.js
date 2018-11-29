import moment from "moment";

export const getFirstTimeCustomers = (customers, menuDate) => {
  // Get week range of menu date
  const menuDateRef = moment(menuDate);
  const nextMenuDate = menuDateRef
    .clone()
    .day(7) // Add a week
    .weekday(4); // Thursday, when menu's get published

  // Get both date values in milis
  const startTime = menuDateRef.startOf("day").valueOf();
  const endTime = nextMenuDate.valueOf();

  // Filter list by property firstOrderDate in range
  return customers.filter(
    customer =>
      customer.firstOrderDate &&
      customer.firstOrderDate >= startTime &&
      customer.firstOrderDate <= endTime
  );
};

export const getNonOrderingCustomers = (customers, daysMissed) => {
  const timeAgo = moment()
    .subtract(daysMissed, "days")
    .startOf("day");

  return customers.filter(
    customer => moment(customer.lastOrderDate).isAfter(timeAgo) === false
  );
};
