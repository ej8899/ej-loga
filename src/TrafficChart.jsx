/* eslint-disable react/prop-types */

'use client';
import  { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';



// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all


export default function TrafficChart({ data }) {
  const [chartData, setChartData] = useState({
    series: [0,1,2,3,4,5],
    
    options: {
      colors: ["#1C64F2", "#16BDCA", "#FFA500", "#E74694",'#FFFF00','#A020F0','orange'],
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
      },
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      // outline colors
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            stroke: null,
            // inner circle labels
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Poppins, sans-serif",
                offsetY: 0,
              },
              total: {
                showAlways: false,
                show: false,
                label: "Uniques:",
                fontFamily: "Poppins, sans-serif",
                color: "#1C64F2",
                
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return `${sum}k`
                },
              },
              value: {
                show: true,
                fontFamily: "Poppins, sans-serif",
                color: "#1C64F2",
                offsetY:5,
                formatter: function (value) {
                  return Math.ceil(parseFloat(value)) + "%";
                },
              },
            },
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["MacOS", "iPad", "iPhone", "Windows", "Android", "Linux"],
      legend: {
        position: "bottom",
        fontFamily: "Poppins, sans-serif",
        labels: {
          colors: "#0099ff",
        }
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          colors: "#FDBA8C",
          formatter: function (value) {
            return Math.ceil(parseFloat(value)) + "%";
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value  + "B"
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    },
  });

  const [barBrowserData, setBrowserBarData] = useState({
    options: {
      chart: {
        stacked: true,
        stackType: "100%",
        type: 'bar',
        toolbar: {
          show: false
        },
        margin: 0,
        height: 550,
        
      },
      plotOptions: {
        bar: {
          horizontal: true,
          // borderRadiusApplication: "around",
          // borderRadiusWhenStacked: 'all',
          // borderRadius: 6,
          barHeight: '20%'
        },
        ticks: {
          position: 'top',
          show: false
        },
      },
      xaxis: {
        //categories: ['category A', ]
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        lines: {
          show: false,
        },
        ticks: {
          show: false
        },
        grid: {
          show: false,
        },
        axisTicks: {
          show: false // Add this to hide the x-axis ticks
        },
        categories: ["web browser: "],
        tooltip: {
          enabled: true,
          fillSeriesColor: false,
          // color: 'red',
          // style: {
          //   color: 'red',
          // },
          x: {
            color: 'yellow',
            show: false,
          },
          onDatasetHover: {
            highlightDataSeries: false,
        }
        },
      },
      yaxis: {
        labels: {
          show: false
        },
        lines: {
          show: false,
        },
      },
      series: [
        {
          name: 'Chrome',
          data: [4]
        },
        {
          name: 'Firefox',
          data: [2]
        },
        {
          name: 'Safari',
          data: [3]
        },
        {
          name: 'Other',
          data: [1],
        }
        // Add more series as needed
      ],
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      ticks: {
        show: false,
      },
    }
  });

  const [siteData, setSiteData] = useState({
    series: [
      {
        data: [400, 430, 540, 2580, 1100, ]
      },
      
    ],
    
    
    options: {
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "100%",
          borderRadiusApplication: "end",
          borderRadius: 3,
          distributed: true,
          dataLabels: {
            show: false,
            total: {
              enabled: false,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
          
        },
      },
      
      stroke: {
        show: false,
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
        categories: ['South', 'Canad', 'Unite', 'Nethe', 'Italy', 
            ],
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
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
        strokeDashArray: 3,
        padding: {
          left: 1,
          right: 1,
          top: -20
        },
      },
    }
  });

  const processEnvironmentSummary = (environmentSummary, totalEntries) => {
    // Process environment summary data and return a new series array
    const androidTotal = ((environmentSummary["Linux armv81"] || 0) + (environmentSummary["Linux armv8l"] || 0)) / totalEntries * 100;
    const linuxTotal = (environmentSummary["Linux x86_64"] || 0) / totalEntries * 100;
    const macOsTotal = (environmentSummary["MacIntel"] || 0) / totalEntries * 100;

    return [
      macOsTotal,
      (environmentSummary["iPad"] || 0) / totalEntries * 100,
      (environmentSummary["iPhone"] || 0) / totalEntries * 100,
      (environmentSummary["Win32"] || 0) / totalEntries * 100,
      androidTotal,
      linuxTotal,
    ];
  };

  useEffect(() => {
    // Process incoming data and update charset

    const seriesData = data.environment_summary[2];
    const browsers = Object.keys(seriesData);
    setBrowserBarData({
      options: {
        ...barBrowserData.options,
        xaxis: {
          ...barBrowserData.options.xaxis,
          categories: ["web browser:"],
        },
        series: browsers.map((browser) => ({
          name: browser,
          data: [seriesData[browser]],
        })),
      },
    });

    if (data && data.environment_summary && data.log_total_entries && data.unique_visitors) {
      const processedData = processEnvironmentSummary(data.environment_summary[1], data.log_total_entries, data.unique_visitors);
      setChartData((prevChartData) => ({ ...prevChartData, series: processedData }));
    }
  }, [data]);

  return (
    
    <div className="max-w-sm m-2 p-6 gap-4 justify-center flex-col flex border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800">
      <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Website Traffic</h5>
          <svg data-popover-target="chart-info" data-popover-placement="bottom" className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
          </svg>
        </div>
        <div>
          &nbsp;
        </div>
      </div>
      
      <Chart options={chartData.options} series={chartData.series} type="donut" width="320" />
      {/* <Chart options={siteData.options} series={siteData.series} width="320" type="bar" /> */}

      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mb-10">
    <div style={{ height: '40px', marginLeft: '-10px', marginTop: '-110px' }}>
      <Chart options={barBrowserData.options} series={barBrowserData.options.series} type="bar" width="320" />
    </div>
    </div>
    </div>
  );
}
