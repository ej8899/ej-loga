
'use client';
import  { useState, useEffect } from 'react';
import Chart from 'react-apexcharts'
// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all


export default function VisitorChart() {
  const [chartData, setChartData] = useState({
    series: [{
      name: 'visitors',
      data: [1, 2, 1, 2, 1, 2, 1]
    }
    ],
    options: {
      chart: {
        height: 350,
        width: "100%",
        type: 'area',
        fontFamily: "Poppins, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 6,
        colors: ['#FFA500'],
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 1,
          opacityTo: 0.1,
          shade: "#FFA500",
          gradientToColors: ["#FFA500"],
          inverseColors: true,
        },
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        },
      },
      yaxis: {
        style: {
          colors: ["#fff"],
          fontSize: "14px",
        },
        stroke: {
          color: "#FFA500",
        },
        labels: {
          color: "#fff",
          colors: ["#fff"],
        },
      },
      xaxis: {
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#78909C',
          height: 6,
          offsetX: 0,
          offsetY: 0
        },
        type: 'datetime',
        colors: ['#FFA500'],
        color: '#FFA500',
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: true,
        color: '#FFA500',
        style: {
          color: '#FFA500',
        },
        x: {
          color: '#FFA500',
          show: false,
        },
      },
    },
  });



  useEffect(() => {
    // TODO fetch our summary data and update here
    // const newSeries = [40, 50, 30, 10];
    const newSeries = [{
      name: 'visitors',
      data: [2, 27, 30, 10, 50, 23, 40]
    }
    ];
    setChartData((prevChartData) => ({ ...prevChartData, series: newSeries }));
  }, []);

  return (
    <div className="max-w-sm p-6 gap-4 justify-center flex-col flex border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">32.4k</h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">Users this week</p>
        </div>
        <div
          className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
          12%
          <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
          </svg>
        </div>
      </div>
  
      <Chart options={chartData.options} series={chartData.series} type="area" width="320" />
  
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-5">
          
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="lastDaysdropdown"
            data-dropdown-placement="bottom"
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
            type="button">
            Last 7 days
            <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          
          <div id="lastDaysdropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
                </li>
              </ul>
          </div>
          <a
            href="#"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
            Users Report
            <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </a>
        </div>
      </div>
  </div>
  );
}
