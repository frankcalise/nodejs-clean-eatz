import React from "react";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";
import LineChart from "recharts/lib/chart/LineChart";
import Line from "recharts/lib/cartesian/Line";
import XAxis from "recharts/lib/cartesian/XAxis";
import YAxis from "recharts/lib/cartesian/YAxis";
import CartesianGrid from "recharts/lib/cartesian/CartesianGrid";
import Tooltip from "recharts/lib/component/Tooltip";
import Legend from "recharts/lib/component/Legend";
import fire from "../../fire";

class OrderCountSummaryChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentWillMount() {
    this.getData();
  }

  getData = () => {
    fire
      .database()
      .ref("orderSummaries")
      .orderByKey()
      .once("value")
      .then(snapshot => {
        const data = [];

        snapshot.forEach(childSnapshot => {
          const summary = childSnapshot.val();
          const { menuDate, numMeals, orderCount } = summary;

          data.push({
            menuDate,
            numMeals,
            orderCount
          });
        });

        this.setState({ data });
      });
  };

  render() {
    return (
      // 99% per https://github.com/recharts/recharts/issues/172
      <ResponsiveContainer width="99%" height={320}>
        <LineChart data={this.state.data}>
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

export default OrderCountSummaryChart;
