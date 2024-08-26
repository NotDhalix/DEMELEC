import React, { Component } from "react";
import BarChart from "./components/BarChart";
import PreliminarWinner from "./components/PreliminarWinner";

function Dashboard () {
    return (
      <div className="dashboard">
      <BarChart/>
      <PreliminarWinner/ >
      </div>
    );
}

export default Dashboard;
