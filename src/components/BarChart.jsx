import React, { Component } from "react";
import Chart from "react-apexcharts";

class BarChart extends Component {
  constructor(props) {
    super(props);

    const seriesData = [712, 316, 195];
    const candidatesOptions = ['NOMBRE PERSONA 1', 'NOMBRE PERSONA 2', 'NOMBRE PERSONA 3'];
    const maxValue = Math.max(...seriesData);
    const maxValueIndex = seriesData.indexOf(Math.max(...seriesData));
    const colors = seriesData.map(value => (value === maxValue ? '#00FF00' : '#FFF'));
    const yaxisLabelColors = candidatesOptions.map((_, index) => (index === maxValueIndex ? '#00FF00' : '#FFF'));

    const isMobile = window.innerWidth <= 768;
    const chartWidth = isMobile ? 380 : 900;
    const chartHeight = isMobile ? 380 : 250;

    this.state = {
      series: [{
        data: seriesData
      }],
      options: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: !isMobile,
            distributed: true,
            barHeight: isMobile ? '100%' : '70%', 
            columnWidth: isMobile ? '60%' : '70%', 
          }
        },
        dataLabels: {
          enabled: true,
          style:{
            colors: '#000',
          }
        },
        xaxis: {
          categories: candidatesOptions,
          labels: {
            style: {
              colors: '#FFF', 
            },
            show: !isMobile
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: yaxisLabelColors,
              fontSize: isMobile ? '12px' : '16px', 
            },
            show: !isMobile 
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
          show: isMobile,
          horizontalAlign: 'center', 
          verticalAlign: 'bottom', 
          itemMargin: {
            horizontal: 20, 
            vertical: 5 
          },
          labels: {
            colors: '#FFF',
            fontSize: '20px'
          },
        },
      },
      chartWidth: chartWidth,
      chartHeight: chartHeight
    };
  }

  render() {
    return (
      <div className="bar-plot">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.series}
              width={this.state.chartWidth}
              height={this.state.chartHeight}
              type="bar"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BarChart;
