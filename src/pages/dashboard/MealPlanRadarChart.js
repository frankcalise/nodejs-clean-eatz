import React from "react";
import RadarChart from "recharts/lib/chart/RadarChart";
import Radar from "recharts/lib/polar/Radar";
import PolarGrid from "recharts/lib/polar/PolarGrid";
import PolarAngleAxis from "recharts/lib/polar/PolarAngleAxis";
import PolarRadiusAxis from "recharts/lib/polar/PolarRadiusAxis";
import firebase from "../../config/firebase";

export default class MealPlanRadarChart extends React.Component {
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
      .ref("orderSummaries")
      .orderByKey()
      .limitToLast(1)
      .once("value")
      .then(snapshot => {
        const data = [];

        snapshot.forEach(childSnapshot => {
          const summary = childSnapshot.val();
          const { meals } = summary;

          Object.keys(meals).forEach(mealKey => {
            const { total } = meals[mealKey];

            data.push({
              name: mealKey,
              total
            });
          });
        });

        this.setState({ data });
      });
  };

  render() {
    const { data } = this.state;

    return (
      <RadarChart width={500} height={320} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis domain={[0, 150]} />
        <Radar
          name="Meals"
          dataKey="total"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />
      </RadarChart>
    );
  }
}
