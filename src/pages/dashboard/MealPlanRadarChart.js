import React from "react";
import { connect } from "react-redux";
import RadarChart from "recharts/lib/chart/RadarChart";
import Radar from "recharts/lib/polar/Radar";
import PolarGrid from "recharts/lib/polar/PolarGrid";
import PolarAngleAxis from "recharts/lib/polar/PolarAngleAxis";
import PolarRadiusAxis from "recharts/lib/polar/PolarRadiusAxis";
import { getLatestOrderSummary } from "../../state/orderSummaries/selectors";

const getState = state => {
  return {
    data: getLatestOrderSummary(state)
  };
};

class MealPlanRadarChart extends React.Component {
  render() {
    const { meals } = this.props.data;

    return (
      <RadarChart width={500} height={320} data={meals}>
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

export default connect(getState)(MealPlanRadarChart);
