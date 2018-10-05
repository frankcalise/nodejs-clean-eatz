import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import WithLoader from "../../components/WithLoader";
import { decodeFirebaseKey } from "../../utils/firebaseUtils";
import { fetchMeals } from "../../state/mealsByMenuDate/actions";

const getState = state => {
  return {
    mealsByMenuDate: state.mealsByMenuDate
  };
};

const getActions = {
  fetchMeals
};

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

class MealsByMenuDate extends React.Component {
  state = {
    loaded: false
  };

  componentDidMount() {
    if (this.props.mealsByMenuDate.length === 0) {
      Promise.all([this.props.fetchMeals()])
        .then(() => {
          this.setState({ loaded: true });
        })
        .catch(err => {
          console.error(err);
          this.setState({ loaded: true });
        });
    }
  }

  render() {
    const { classes } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    const meals = this.props.mealsByMenuDate.map(meal => {
      const dateKeys = Object.keys(meal).filter(dateKey => {
        return dateKey !== "key";
      });

      const dateCounts = dateKeys.map(dateKey => {
        const count = meal[dateKey];
        return (
          <p key={dateKey}>
            {dateKey} {bull} {count}
          </p>
        );
      });

      return (
        <Grid item xs key={meal.key}>
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="headline" component="h2">
                {decodeFirebaseKey(meal.key)}
              </Typography>
              <Typography component="p">{dateCounts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    });

    return (
      <WithLoader
        condition={this.state.loaded}
        message="Loading Meals By Menu Date"
      >
        <Grid container spacing={8}>
          {meals}
        </Grid>
      </WithLoader>
    );
  }
}

export default connect(
  getState,
  getActions
)(withStyles(styles)(MealsByMenuDate));
