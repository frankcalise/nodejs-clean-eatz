import React from "react";
import { connect } from "react-redux";
import BarChart from "recharts/lib/chart/BarChart";
import Bar from "recharts/lib/cartesian/Bar";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import Legend from "recharts/lib/component/Legend";
import { getLatestOrderSummary } from "../../state/orderSummaries/selectors";

const getState = state => {
  return {
    data: getLatestOrderSummary(state.orderSummaries)
  };
};

class MealPlanStackedBarChart extends React.Component {
  render() {
    const { meals } = this.props.data;

    return (
      <BarChart width={600} height={300} data={meals}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={false} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="Standard" dataKey="standard" stackId="a" fill="#ff8042" />
        <Bar
          name="Extra Protein"
          dataKey="extraProtein"
          stackId="a"
          fill="#8884d8"
        />
        <Bar
          name="Gluten Free"
          dataKey="glutenFree"
          stackId="a"
          fill="#ffc658"
        />
        <Bar name="Half Carb" dataKey="halfCarb" stackId="a" fill="#0088fe" />
        <Bar name="No Carb" dataKey="noCarb" stackId="a" fill="#82ca9d" />
      </BarChart>
    );
  }
}

export default connect(getState)(MealPlanStackedBarChart);
