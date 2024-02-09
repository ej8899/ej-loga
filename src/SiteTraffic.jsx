/* eslint-disable react/prop-types */

'use client';
import  { useState, useEffect } from 'react';
import Chart from 'react-apexcharts'
// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all


export default function SiteTraffic({data}) {

  const [chartData, setChartData] = useState({
    series: [
      {
        data: [400, 430, 448, 470, 540, 2580, 690, 1100, 1200, 1380]
      },
      
    ],
    chart: {
      height: 350,
      type: 'bar',
      animations: {
        enabled: true
      },
    },
    
    options: {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "90%",
          borderRadiusApplication: "end",
          borderRadius: 3,
          distributed: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },

      fill: {
        opacity: 0.7
      },

      legend: {
        show: false,
        position: "bottom",
      },

      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        formatter: function (value) {
          return "$" + value
        }
      },

      xaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          },
          formatter: function(value) {
            return "" + value
          }
        },
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
              'United States', 'China', 'Germany'
            ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          }
        }
      },
    
      grid: {
        show: true,
        strokeDashArray: 8,
        padding: {
          left: 2,
          right: 2,
          top: -20
        },
      },
    }
  });


  useEffect(() => {
    // if (data) {

    //   setChartData((prevChartData) => ({ ...prevChartData, 
    //     series: [ parseInt(data.environment_summary[0].Desktop/data.unique_visitors),
    //               parseInt(data.environment_summary[0].Mobile/data.unique_visitors)
    //             ] }));
    // }
  }, [data]);

  return (
    <div className="m-10 mt-2 p-6 gap-4 justify-center flex-col flex border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  
    <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Traffic Per Site</h5>
            <svg data-popover-target="chart-info" data-popover-placement="bottom" className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
            </svg>            
          </div>
    </div>
  
    <div className="" >
      <Chart options={chartData.options} series={chartData.series} width="600" type="bar" />
    </div>

  </div>
  );
}
