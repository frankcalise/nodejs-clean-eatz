import React from "react";
import { connect } from "react-redux";
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
    const meals = this.props.mealsByMenuDate.map(meal => {
      const dateKeys = Object.keys(meal).filter(dateKey => {
        return dateKey !== "key";
      });

      const dateCounts = dateKeys.map(dateKey => {
        const count = meal[dateKey];
        return (
          <li key={dateKey}>
            {dateKey}: {count}
          </li>
        );
      });

      return (
        <li key={meal.key}>
          {decodeFirebaseKey(meal.key)}
          <ul>{dateCounts}</ul>
        </li>
      );
    });

    return (
      <WithLoader
        condition={this.state.loaded}
        message="Loading Meals By Menu Date"
      >
        <ul>{meals}</ul>
      </WithLoader>
    );
  }
}

export default connect(
  getState,
  getActions
)(MealsByMenuDate);
