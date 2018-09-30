import React from "react";
import firebase from "../../config/firebase";
import { decodeFirebaseKey, snapshotToArray } from "../../utils/firebaseUtils";

export default class MealsByMenuDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    firebase
      .database()
      .ref(`mealsByMenuDate`)
      .once("value")
      .then(snapshot => {
        const data = snapshotToArray(snapshot);
        this.setState({ data });
      });
  };

  render() {
    if (this.state.data.length === 0) {
      return <div className="meals-by-menu-date empty">Loading...</div>;
    }

    const meals = this.state.data.map(meal => {
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
      <div className="meals-by-menu-date">
        <ul>{meals}</ul>
      </div>
    );
  }
}
