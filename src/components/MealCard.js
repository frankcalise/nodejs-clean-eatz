import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
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
  const { customer, orderDate, meals } = order;
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
          {customer.email} {bull} {customer.phone}
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
        </Typography>
      </CardContent>
      <CardActions className={classes.actions}>
        {extraProtein && (
          <Chip label="Extra Protein" className={classes.chip} />
        )}
        {halfCarb && <Chip label="Half Carb" className={classes.chip} />}
        {noCarb && <Chip label="No Carb" className={classes.chip} />}
        {glutenFree && <Chip label="Gluten Free" className={classes.chip} />}
      </CardActions>
    </Card>
  );
};

MealCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MealCard);
