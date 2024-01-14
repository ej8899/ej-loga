/* eslint-disable react/prop-types */

'use client';
import  { useState, useEffect } from 'react';
import Chart from 'react-apexcharts'
import { Tooltip } from 'flowbite-react';

// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all

const downloadCSV = (dateCounts) => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  if (!dateCounts) return;

  // Create headers
  const headers = ['Date', 'Count'];
  csvContent += headers.join(',') + '\n';

  // Add rows
  Object.keys(dateCounts).forEach((date) => {
    const count = dateCounts[date];
    csvContent += `${date},${count}\n`;
  });

  // Create a data URI and trigger download
  const encodedURI = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedURI);
  link.setAttribute('download', 'erniejohnson.ca_interactions_by_date.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



export default function LogChart({data}) {
  const [chartData, setChartData] = useState({
    series: [0,0,0,0,0],
    
    options: {
      // colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694","teal","orange"],
      colors: ["#FCD34Dcc", "#EF4444cc", "#A855F7cc", "#818CF8cc",'#03a9f4cc','#A020F0','orange'],
              // warnings, errors,    fatal,      debug, trace
              // chart for hex to transparency %: https://stackoverflow.com/questions/23201134/transparent-argb-hex-value
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
                showAlways: true,
                show: true,
                label: "total:",
                fontFamily: "Poppins, sans-serif",
                color: "#1C64F2",
                
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                  return `${sum}`
                },
              },
              value: {
                show: true,
                fontFamily: "Poppins, sans-serif",
                color: "#1C64F2",
                offsetY:5,
                // inner circle text
                formatter: function (value) {
                  return value;
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
      labels: ["warnings", "errors\n", "fatal",'debug','trace'],
      // info was item 1
      legend: {
        position: "bottom",
        fontFamily: "Poppins, sans-serif",
        labels: {
          colors: "#0099ff",
        },
        style: {
          width: "350px"
        }
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        labels: {
          colors: "#FDBA8C",
          formatter: function (value) {
            return value
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value  + "B"
          },
          style: {
            whiteSpace: "pre"
          }
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


  const handleDownloadClick = () => {
    downloadCSV(data);
  };

  // useEffect(() => {
  //   // TODO fetch our summary data and update here
  //   const newSeries = [40, 50, 30, 710,23,12];
  //   setChartData((prevChartData) => ({ ...prevChartData, series: newSeries }));
  // }, []);

  useEffect(() => {
    if (data) {
      // Extract the required data for the chart
      const levelsData = Object.values(data.log_levels_count);
      levelsData.splice(1,1);
      // Update the chart series with the new data
      setChartData((prevChartData) => ({
        ...prevChartData,
        series: levelsData,
      }));
    }
  }, [data]);

  return (
    <div className="max-w-sm {className} m-2 p-6 gap-4 justify-center flex-col flex border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  
    <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Log Stats ({parseFloat(data.log_file_size/1024/1000).toFixed(2)}MB)</h5>
            <svg data-popover-target="chart-info" data-popover-placement="bottom" className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
            </svg>
            <div data-popover id="chart-info" role="tooltip" className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Activity growth - Incremental</h3>
                    <p>Report helps navigate cumulative growth of community activities. Ideally, the chart should have a growing trend, as stagnating chart signifies a significant decrease of community activity.</p>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Calculation</h3>
                    <p>For each date bucket, the all-time volume of activities is calculated. This means that activities in period n contain all activities up to period n, plus the activities generated by your community in period.</p>
                    <a href="#" className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline">Read more <svg className="w-2 h-2 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg></a>
                </div>
                <div data-popper-arrow></div>
            </div>
          </div>
        <div>
        <Tooltip content="Download CSV of data">
          <button 
            type="button"
            onClick={() => downloadCSV(data.date_counts)}
            data-tooltip-target="data-tooltip"
            data-tooltip-placement="bottom" 
            className="hidden sm:inline-flex items-center justify-center text-gray-500 w-8 h-8 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm"><svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 1v11m0 0 4-4m-4 4L4 8m11 4v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3"/>
    </svg><span className="sr-only">Download data</span>
          </button>
          </Tooltip>
        </div>
    </div>
  
    <Chart options={chartData.options} series={chartData.series} type="donut" width="320" />
  
    <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mb-4">
     &nbsp;
    </div>
  </div>
  );
}
