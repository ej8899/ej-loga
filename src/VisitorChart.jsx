/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */

'use client';
import  { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'flowbite-react';
import { Tooltip } from 'flowbite-react';
import Chart from 'react-apexcharts'
// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all


export default function VisitorChart({ data }) {
  const dropdownRef = useRef(null);

  const [chartData, setChartData] = useState({
    series: [{
      name: 'interactions',
      data: [1, 2, 1, 2, 1, 2, 1]
    }],
    options: {
      chart: {
        foreColor: "#0099ff",
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
          color: '#777',
          height: 6,
          offsetX: 0,
          offsetY: 0
        },
        type: 'datetime',
        colors: ['#777'],
        color: '#777',
        // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
      },
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
    // console.log("Insufficient data for traffic change calculation.");
  }
};

// useEffect(() => {
//     if (data && data.date_counts) {
//       calculateTrafficChange();
//       // Extract the required data for the chart
//       const dates = Object.keys(data.date_counts);
//       const visitorsData = dates.map((date) => data.date_counts[date]);

//       // Update the chart series with the new data
//       setChartData((prevChartData) => ({
//         ...prevChartData,
//         series: [{ name: 'visitors', data: visitorsData }],
//         options: {
//           ...prevChartData.options,
//           xaxis: {
//             ...prevChartData.options.xaxis,
//             categories: dates,
//           },
//         },
//       }));
//     }
//   }, [data, selectedDays]);

  const updateChartData = (dates, visitorsData) => {
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
  };

  useEffect(() => {
    // Update the chart data based on the selected item
    if (data && data.date_counts) {
      calculateTrafficChange();
      let dates = Object.keys(data.date_counts);
      let visitorsData = dates.map((date) => data.date_counts[date]);
      
      const todayUTC = new Date();
      switch (selectedDays) {
        case "Last 7 Days":
          todayUTC.setUTCHours(0, 0, 0, 0);
        
          // Calculate the date 7 days ago in UTC
          const sevenDaysAgoUTC = new Date(todayUTC);
          sevenDaysAgoUTC.setUTCDate(todayUTC.getUTCDate() - 6);
        
          // Initialize arrays for dates and visitorsData
          let datesLast7Days = [];
          let visitorsDataLast7Days = [];
        
          // Loop through the last 7 days (including today) in UTC and populate the arrays
          for (let i = new Date(sevenDaysAgoUTC); i <= todayUTC; i.setUTCDate(i.getUTCDate() + 1)) {
            const currentDate = i.toISOString().split('T')[0];
            const count = data.date_counts[currentDate] || 0;
        
            datesLast7Days.push(currentDate);
            visitorsDataLast7Days.push(count);
          }
          // console.log(datesLast7Days)
          // console.log(visitorsDataLast7Days)
          updateChartData(datesLast7Days, visitorsDataLast7Days);
          break;
            
          case "Last 14 Days":
            todayUTC.setUTCHours(0, 0, 0, 0);
          
            // Calculate the date 14 days ago in UTC
            const fourteenDaysAgoUTC = new Date(todayUTC);
            fourteenDaysAgoUTC.setUTCDate(todayUTC.getUTCDate() - 13);
          
            // Initialize arrays for dates and visitorsData
            let datesLast14Days = [];
            let visitorsDataLast14Days = [];
          
            // Loop through the last 14 days (including today) in UTC and populate the arrays
            for (let i = new Date(fourteenDaysAgoUTC); i <= todayUTC; i.setUTCDate(i.getUTCDate() + 1)) {
              const currentDate = i.toISOString().split('T')[0];
              const count = data.date_counts[currentDate] || 0;
          
              datesLast14Days.push(currentDate);
              visitorsDataLast14Days.push(count);
            }
    
            updateChartData(datesLast14Days, visitorsDataLast14Days);
            break;

          case "Last 30 Days":
            todayUTC.setUTCHours(0, 0, 0, 0);
            
            // Calculate the date 30 days ago in UTC
            const thirtyDaysAgoUTC = new Date(todayUTC);
            thirtyDaysAgoUTC.setUTCDate(todayUTC.getUTCDate() - 29);
            
            // Initialize arrays for dates and visitorsData
            let datesLast30Days = [];
            let visitorsDataLast30Days = [];
            
            // Loop through the last 30 days (including today) in UTC and populate the arrays
            for (let i = new Date(thirtyDaysAgoUTC); i <= todayUTC; i.setUTCDate(i.getUTCDate() + 1)) {
              const currentDate = i.toISOString().split('T')[0];
              const count = data.date_counts[currentDate] || 0;
            
              datesLast30Days.push(currentDate);
              visitorsDataLast30Days.push(count);
            }
          
            updateChartData(datesLast30Days, visitorsDataLast30Days);
            break;
          case "Last 90 Days":
            todayUTC.setUTCHours(0, 0, 0, 0);
            
            // Calculate the date 90 days ago in UTC
            const ninetyDaysAgoUTC = new Date(todayUTC);
            ninetyDaysAgoUTC.setUTCDate(todayUTC.getUTCDate() - 89);
            
            // Initialize arrays for dates and visitorsData
            let datesLast90Days = [];
            let visitorsDataLast90Days = [];
            
            // Loop through the last 90 days (including today) in UTC and populate the arrays
            for (let i = new Date(ninetyDaysAgoUTC); i <= todayUTC; i.setUTCDate(i.getUTCDate() + 1)) {
              const currentDate = i.toISOString().split('T')[0];
              const count = data.date_counts[currentDate] || 0;
            
              datesLast90Days.push(currentDate);
              visitorsDataLast90Days.push(count);
            }
          
            updateChartData(datesLast90Days, visitorsDataLast90Days);
            break;
          case "Last 180 Days":
            todayUTC.setUTCHours(0, 0, 0, 0);
            
            // Calculate the date 180 days ago in UTC
            const oneEightyDaysAgoUTC = new Date(todayUTC);
            oneEightyDaysAgoUTC.setUTCDate(todayUTC.getUTCDate() - 179);
            
            // Initialize arrays for dates and visitorsData
            let datesLast180Days = [];
            let visitorsDataLast180Days = [];
            
            // Loop through the last 180 days (including today) in UTC and populate the arrays
            for (let i = new Date(oneEightyDaysAgoUTC); i <= todayUTC; i.setUTCDate(i.getUTCDate() + 1)) {
              const currentDate = i.toISOString().split('T')[0];
              const count = data.date_counts[currentDate] || 0;
            
              datesLast180Days.push(currentDate);
              visitorsDataLast180Days.push(count);
            }

            updateChartData(datesLast180Days, visitorsDataLast180Days);
            break;

          case "Last 365 Days":
            todayUTC.setUTCHours(0, 0, 0, 0);
            
            // Calculate the date 365 days ago in UTC
            const threeSixtyFiveDaysAgoUTC = new Date(todayUTC);
            threeSixtyFiveDaysAgoUTC.setUTCDate(todayUTC.getUTCDate() - 364);
            
            // Initialize arrays for dates and visitorsData
            let datesLast365Days = [];
            let visitorsDataLast365Days = [];
            
            // Loop through the last 365 days (including today) in UTC and populate the arrays
            for (let i = new Date(threeSixtyFiveDaysAgoUTC); i <= todayUTC; i.setUTCDate(i.getUTCDate() + 1)) {
              const currentDate = i.toISOString().split('T')[0];
              const count = data.date_counts[currentDate] || 0;
            
              datesLast365Days.push(currentDate);
              visitorsDataLast365Days.push(count);
            }
          
            updateChartData(datesLast365Days, visitorsDataLast365Days);
            break;
            

        default:
          // Default case
          dates = Object.keys(data.date_counts);
          visitorsData = dates.map((date) => data.date_counts[date]);
          updateChartData(dates, visitorsData);
      }

      // You may want to modify the chart data based on the selected item
      // For now, I'll just log a message
      // console.log('Updating chart data for selected item:', selectedDays);

      // Update the chart series with the new data
      // setChartData((prevChartData) => ({
      //   ...prevChartData,
      //   series: [{ name: 'visitors', data: visitorsData }],
      //   options: {
      //     ...prevChartData.options,
      //     xaxis: {
      //       ...prevChartData.options.xaxis,
      //       categories: dates,
      //     },
      //   },
      // }));
    }
  }, [data, selectedDays]);


  const handleItemClick = (event) => {
    //const selectedItem = event.target.textContent;
    let label = "Today";
    // console.log('Selected item:', event);
    switch (event) {
      // case 0:
      //   label = "Today";
      //   break;
      // case 1:
      //   label = "Yesterday";
      //   break;
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
        label = "Last 180 Days";
        break;
      case 7:
        label = "Last 365 Days";
        break;
      default:
        label = "error";
    }
    setSelectedDays(label);
    // Perform any other necessary actions
  };

  return (
    <div className="max-w-sm m-2 p-6 gap-4 justify-center flex-col flex border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  
  <div className="flex justify-between mb-0">
        <div className="flex justify-center items-center mb-10">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Visitor interactions</h5>
            <Tooltip content="visitor traffic (not uniques)">
            <svg data-popover-target="chart-info" data-popover-placement="bottom" className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z"/>
            </svg>
            </Tooltip>
          </div>
        <div>
        {trafficChange > 0 ? (
              <Tooltip content="increase from yesterday"><div
              className="flex items-center px-2.5 py-0.5 text-base font-semibold text-center text-green-500 dark:text-green-500">{trafficChange}% <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">  
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
              </svg>
              </div>
              </Tooltip>
            ) : (
              <Tooltip content="decrease from yesterday"><div
              className="flex items-center px-2.5 py-0.5 text-base font-semibold text-center text-orange-500 dark:text-orange-500">{trafficChange}% <svg className="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                <path stroke="orangered" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1v12m0 0 4-4m-4 4L1 9"/>
              </svg>
              </div></Tooltip>
            )}
        </div>
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
              <Dropdown.Item onClick={() => handleItemClick(7)}>Last 365 days</Dropdown.Item>
            </Dropdown>
          </div>

          {/* <a
            href="#"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
            Users Report
            <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </a> */}
        </div>
      </div>
  </div>
  );
}
