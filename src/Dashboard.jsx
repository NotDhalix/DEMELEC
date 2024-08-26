import React, { Component } from "react";
import Chart from "react-apexcharts";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    const seriesData = [712, 316, 195];
    const candidatesOptions = ['NOMBRE PERSONA 1', 'NOMBRE PERSONA 2', 'NOMBRE PERSONA 3'];
    const maxValue = Math.max(...seriesData);
    const maxValueIndex = seriesData.indexOf(Math.max(...seriesData));
    const colors = seriesData.map(value => (value === maxValue ? '#00FF00' : '#FFF'));
    const yaxisLabelColors = candidatesOptions.map((_, index) => (index === maxValueIndex ? '#00FF00' : '#FFF'));

      this.state = {
      series: [{
        data: seriesData
      }],
      options: {
        chart: {
          type: 'bar',
          toolbar:{
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true
          }
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: candidatesOptions,
          labels: {
            style: {
              colors: '#FFF', 
            },
            show: false
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: yaxisLabelColors,
              fontSize: '16px', 
            },
            maxWidth: 500, 
          }
        },
        grid: {
          borderColor: 'none'
        },
        colors: colors,
        tooltip: {
          enabled: false 
      },
      legend: {
        show: false
      },
    }
    };
  }

  render() {
    return (
      <>
      <div className="bar-plot">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="900"
              height="250"
            />
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default Dashboard;
