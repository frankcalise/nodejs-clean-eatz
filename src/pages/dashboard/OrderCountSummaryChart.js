import React from "react";
import { connect } from "react-redux";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import LineChart from "recharts/lib/chart/LineChart";
import Line from "recharts/lib/cartesian/Line";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import Legend from "recharts/lib/component/Legend";

const getState = state => {
  return {
    data: state.orderSummaries
  };
};

class OrderCountSummaryChart extends React.Component {
  render() {
    return (
      // 99% per https://github.com/recharts/recharts/issues/172
      <ResponsiveContainer width="99%" height={320}>
        <LineChart data={this.props.data}>
          <XAxis dataKey="menuDate" />
          <YAxis />
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            name="# Meals"
            dataKey="numMeals"
            stroke="#82ca9d"
          />
          <Line
            type="monotone"
            name="# Orders"
            dataKey="orderCount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

export default connect(getState)(OrderCountSummaryChart);
