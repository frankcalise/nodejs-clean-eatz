import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import ClearIcon from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  chip: {
    margin: theme.spacing.unit
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  }
});

const MealCard = ({ ...props }) => {
  const { classes, order } = props;
  const {
    customer,
    orderDate,
    meals,
    firstTimeCustomer,
    satellite,
    satellitePickUp,
    total,
    payment,
    missedPickup
  } = order;
  const bull = <span className={classes.bullet}>•</span>;
  const { extraProtein, glutenFree, halfCarb, noCarb } = meals[0];

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary">
          {moment(orderDate).format("MM/DD/YYYY hh:mm A")}
        </Typography>
        <Typography variant="headline" component="h2">
          {customer.name}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          <span>{customer.email}</span>
          <br />
          <span>{customer.phone}</span>
        </Typography>
        <Typography component="p">
          {meals.map(meal => {
            return (
              <React.Fragment key={meal.name}>
                <span>
                  {meal.name} {bull} {meal.qty}
                </span>
                <br />
              </React.Fragment>
            );
          })}
          <br />
          <span>
            {payment.indexOf("cash") > 0 ? "Cash" : payment} {bull} ${total}
          </span>
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        {firstTimeCustomer && (
          <Chip label="New Customer" color="primary" className={classes.chip} />
        )}
        {satellite && (
          <Chip
            label={satellitePickUp}
            color="secondary"
            className={classes.chip}
          />
        )}
        {extraProtein && (
          <Chip label="Extra Protein" className={classes.chip} />
        )}
        {halfCarb && <Chip label="Half Carb" className={classes.chip} />}
        {noCarb && <Chip label="No Carb" className={classes.chip} />}
        {glutenFree && <Chip label="Gluten Free" className={classes.chip} />}
        {missedPickup && (
          <Chip
            avatar={
              <Avatar>
                <ClearIcon />
              </Avatar>
            }
            label="Missed Pickup"
            color="secondary"
            variant="outlined"
          />
        )}
      </CardActions>
    </Card>
  );
};

MealCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MealCard);
