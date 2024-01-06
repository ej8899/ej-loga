/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */

'use client';
import  { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'flowbite-react';
import Chart from 'react-apexcharts'
// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all


export default function VisitorChart({ data }) {
  const dropdownRef = useRef(null);

  const [chartData, setChartData] = useState({
    series: [{
      name: 'visitors',
      data: [1, 2, 1, 2, 1, 2, 1]
    }],
    options: {
      chart: {
        height: 380,
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

const [selectedDays, setSelectedDays] = useState('Last 7 days');
const [trafficChange, setTrafficChange] = useState('16.3%');

const calculateTrafficChange = () => {
  const dates = Object.keys(data.date_counts);

  // Check if data for today and yesterday exists
  if (dates.length >= 2) {
    const todayCount = data.date_counts[dates[dates.length - 1]];
    const yesterdayCount = data.date_counts[dates[dates.length - 2]];

    const percentageChange = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
    setTrafficChange(percentageChange.toFixed(0));
  } else {
    setTrafficChange('-');
    console.log("Insufficient data for traffic change calculation.");
  }
};

useEffect(() => {
    if (data && data.date_counts) {
      calculateTrafficChange();
      // Extract the required data for the chart
      const dates = Object.keys(data.date_counts);
      const visitorsData = dates.map((date) => data.date_counts[date]);

      // Update the chart series with the new data
      setChartData((prevChartData) => ({
        ...prevChartData,
        series: [{ name: 'visitors', data: visitorsData }],
        options: {
          ...prevChartData.options,
          xaxis: {
            ...prevChartData.options.xaxis,
            categories: dates,
          },
        },
      }));
    }
  }, [data, selectedDays]);

  useEffect(() => {
    // Update the chart data based on the selected item
    if (data && data.date_counts) {
      calculateTrafficChange();
      let dates = Object.keys(data.date_counts);
      let visitorsData = dates.map((date) => data.date_counts[date]);
      
      const today = new Date();
      switch (selectedDays) {
        case "Today":
          // Check if today is in data.date_counts
          const todayFormatted = new Date().toISOString().split('T')[0];
          if (data.date_counts.hasOwnProperty(todayFormatted)) {
            // If today is in data.date_counts, use its count
            dates = [todayFormatted];
            visitorsData = [data.date_counts[todayFormatted]];
          } else {
            // If today is not in data.date_counts, set counts to 0
            dates = [todayFormatted];
            visitorsData = [0];
          }
          break;
        case "Yesterday":
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayFormatted = yesterday.toISOString().split('T')[0];

          // Check if yesterday is in data.date_counts
          if (data.date_counts.hasOwnProperty(yesterdayFormatted)) {
            // If yesterday is in data.date_counts, use its count
            dates = [yesterdayFormatted];
            visitorsData = [data.date_counts[yesterdayFormatted]];
          } else {
            // If yesterday is not in data.date_counts, set counts to 0
            dates = [yesterdayFormatted];
            visitorsData = [0];
          }
          break;
        case "Last 7 Days":
          today.setHours(0, 0, 0, 0);
          // Calculate the date 7 days ago
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 7);

          // Initialize arrays for dates and visitorsData
          let datesLast7Days = [];
          let visitorsDataLast7Days = [];

          // Loop through the last 7 days and populate the arrays
          for (let i = sevenDaysAgo; i <= today; i.setDate(i.getDate() + 1)) {
            const currentDate = i.toISOString().split('T')[0];
            const count = data.date_counts[currentDate] || 0;

            datesLast7Days.push(currentDate);
            visitorsDataLast7Days.push(count);
          }
          break;
            // Add cases for other selectedDays as needed

        default:
          // Default case
          dates = Object.keys(data.date_counts);
          visitorsData = dates.map((date) => data.date_counts[date]);
      }

      // You may want to modify the chart data based on the selected item
      // For now, I'll just log a message
      console.log('Updating chart data for selected item:', selectedDays);

      // Update the chart series with the new data
      setChartData((prevChartData) => ({
        ...prevChartData,
        series: [{ name: 'visitors', data: visitorsData }],
        options: {
          ...prevChartData.options,
          xaxis: {
            ...prevChartData.options.xaxis,
            categories: dates,
          },
        },
      }));
    }
  }, [data, selectedDays]);


  const handleItemClick = (event) => {
    //const selectedItem = event.target.textContent;
    let label = "Today";
    // console.log('Selected item:', event);
    switch (event) {
      case 0:
        label = "Today";
        break;
      case 1:
        label = "Yesterday";
        break;
      case 2:
        label = "Last 7 Days";
        break;
      case 3:
        label = "Last 14 Days";
        break;
      case 4:
        label = "Last 30 Days";
        break;
      case 5:
        label = "Last 90 Days";
        break;
      case 6:
        label = "Last 365 Days";
        break;
      default:
        label = "error";
    }
    setSelectedDays(label);
    // Perform any other necessary actions
  };

  return (
    <div className="max-w-sm p-6 gap-4 justify-center flex-col flex border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  
      <div className="flex justify-between">
        <div>
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Interactions Logged</h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400 mb-4">&nbsp;</p>
        </div>
            {trafficChange > 0 ? (
              <div
              className="flex items-center px-2.5 py-0.5 text-base font-semibold text-center text-green-500 dark:text-green-500">{trafficChange}% <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">  
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
              </svg>
              </div>
              
            ) : (
              <div
              className="flex items-center px-2.5 py-0.5 text-base font-semibold text-center text-orange-500 dark:text-orange-500">{trafficChange}% <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                <path stroke="orangered" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v12m0 0 4-4m-4 4L1 9"/>
              </svg>
              </div>
            )}
        
      </div>
  
      <Chart options={chartData.options} series={chartData.series} type="area" width="320" />
  
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-5">
          
          <div id="lastDaysdropdown" ref={dropdownRef} >
            <Dropdown 
              label="" 
              dismissOnClick={true} 
              renderTrigger={() => <span className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
              >
                {selectedDays} <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg></span>} className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {/* <Dropdown.Item onClick={() => handleItemClick(0)}>Today</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick(1)}>Yesterday</Dropdown.Item> */}
              <Dropdown.Item onClick={() => handleItemClick(2)}>Last 7 days</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick(3)}>Last 14 days</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick(4)}>Last 30 days</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick(5)}>Last 90 days</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick(6)}>Last 180 days</Dropdown.Item>
              <Dropdown.Item onClick={() => handleItemClick(6)}>Last 365 days</Dropdown.Item>
            </Dropdown>
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
