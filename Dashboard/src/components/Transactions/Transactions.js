import React from "react";
import LineChart from "../LineChart/LineChart";
import StackedBarChart from "../StackedBarChart/StackedBarChart";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./Transactions.scss";

const summary = gql(`
query MonthlySummary($from:String!, $to:String!, $tokens:[String]!, $spendTypes:[String]!, $gender:[String]!, $txType:[String]!, $tradeType:String!){
  monthlySummaryData  (fromDate:$from, toDate:$to,  tokenName:$tokens, spendType:$spendTypes, gender:$gender, txType:$txType, request:$tradeType){ 
    value
  }
}
`);

export default class Transactions extends React.Component {
  render() {
    return (
      <section id="transactions">
        <p className="title">NO OF TRANSACTIONS</p>
        <Query
          query={summary}
          variables={{
            from: this.props.from,
            to: this.props.to,
            tokens: this.props.tokens,
            spendTypes: this.props.spendTypes,
            gender: this.props.gender,
            txType: this.props.txType,
            tradeType: `transactioncount-time-${this.props.tradeType}`
          }}
        >
          {({ loading, error, data }) => {
            const colors =
              this.props.tradeType === "gender"
                ? ["#3b5998", "#8b9dc3", "#536878", "#4279a3"]
                : [
                    "#38DCE2",
                    "#32AF93",
                    "#248890",
                    "#74D485",
                    "#68EEAB",
                    "#CAF270",
                    "#2FADB6",
                    "#66FCF1",
                    "#1A505B",
                    "#4472C4",
                    "#1B2A37",
                    "#8EBFF2"
                  ];
            if (loading) {
              return <p>Loading data...</p>;
            } else if (error) {
              return <p>Section will be loaded shortly</p>;
            } else {
              const chartData = data.monthlySummaryData[0].value;
              if (chartData.length > 0) {
                return this.props.tradeType === "spendtype" ? (
                  <StackedBarChart
                    title={"Transactions"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={900}
                    height={325}
                    startMonth={this.props.from}
                    endMonth={this.props.to}
                    colors={colors}
                  />
                ) : (
                  <LineChart
                    title={"Transactions"}
                    data={chartData}
                    keys={Object.keys(chartData[0]).slice(1)}
                    width={900}
                    height={325}
                    startMonth={this.props.from}
                    endMonth={this.props.to}
                    colors={colors}
                  />
                );
              }
            }
          }}
        </Query>
      </section>
    );
  }
}
