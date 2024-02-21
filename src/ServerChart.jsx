/* eslint-disable react/prop-types */

'use client';
import  { useState, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import Chart from 'react-apexcharts'
import IconExpand from './IconExpand';
// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all


export default function ServerChart({data}) {
  const [openModal, setOpenModal] = useState(false);

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
          data: [1]
        },
        {
          name: 'Firefox',
          data: [1]
        },
        {
          name: 'Safari',
          data: [1]
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

  const [chartData, setChartData] = useState({
    series: [0,1,],
    
    options: {
      // colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694","teal","orange"],
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
                formatter: function (value) {
                  return value + "%"
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
      labels: ["desktop", "mobile"],
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
            return value
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

  const [clickData,setClickData] = useState({
    series: [{
      name: 'SITESHORTCODE',
      data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
        min: 10,
        max: 60
      })
    },
    {
      name: 'TEAM 2',
      data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, {
        min: 10,
        max: 60
      })
    },
    {
      name: 'TEAM 3',
      data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 30, {
        min: 10,
        max: 60
      })
    },
    {
      name: 'TEAM 4',
      data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
        min: 10,
        max: 60
      })
    },
  ],
  options: {
    "markers": {
      "size": 5,
      "strokeWidth": 0,
      "hover": {
          "size": 10,
          "sizeOffset": 2
      }
    },
    
    chart: {
      height: 350,
      type: 'scatter',
      zoom: {
        type: 'xy'
      },
      // zoom: {
      //   enabled: false,
      // },
      toolbar: {
        show: true
      }
    },
    dataLabels: {
      enabled: false
    },
    annotations: {
      label: {
        style: {
          fillColor: 'orange',
          borderColor: 'orange',  
        }
        
      },
      fillColor: 'orange',
      borderColor: 'orange',
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: 'slategray',
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        style: {
            colors: "#0e81df"
        }
      },
    },
    yaxis: {
      max: 100,
      min: 0,
      labels: {
        style: {
            colors: "#0e81df"
        }
      },
    },
    legend: {
      show: true,
      labels: {
        colors: 'slategray'
      }
    }
  },

});


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=daily');

      if (response.ok) {
        const jsonData = await response.json();

        // Format the fetched data into the required series format
        const formattedData = jsonData.map(entry => ({
          name: entry.name,
          data: entry.data.map(item => [(item[0]), item[1]])
        }));

        // Calculate y-axis max value based on mean + 3 * standard deviation
        const allDataPoints = formattedData.flatMap(entry => entry.data.map(item => item[1]));
        const mean = allDataPoints.reduce((acc, val) => acc + val, 0) / allDataPoints.length;
        const variance = allDataPoints.reduce((acc, val) => acc + (val - mean) ** 2, 0) / allDataPoints.length;
        const stdDeviation = Math.sqrt(variance);
        const yAxisMax = mean + 1 * stdDeviation;

        // Update the state with the fetched data
        setClickData({
          ...clickData,
          series: formattedData
        });
        setClickData(prevState => ({
          ...prevState,
          options: {
            ...prevState.options,
            yaxis: {
              ...prevState.options.yaxis,
              max: yAxisMax
            }
          }
        }));
        // console.log('yaxismax:',yAxisMax)
        // console.log('new click data:',clickData)
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    if (data) {
      // Extract the required data for the chart
      
      // const browsers = Object.keys(seriesData);
      
      // setBrowserBarData({
      //   options: {
      //     ...barBrowserData.options,
      //     xaxis: {
      //       ...barBrowserData.options.xaxis,
      //       categories: ["web browser:"],
      //     },
      //     series: browsers.map((browser) => ({
      //       name: browser,
      //       data: [seriesData[browser]],
      //     })),
      //   },
      // });

      setChartData((prevChartData) => ({ ...prevChartData, 
        series: [ parseInt((data.environment_summary[0].Desktop)/(parseInt(data.environment_summary[0].Desktop)+parseInt(data.environment_summary[0].Mobile))*100), 
        
        parseInt((data.environment_summary[0].Mobile)/(parseInt(data.environment_summary[0].Mobile)+parseInt(data.environment_summary[0].Desktop))*100),
                ] }));
    }
  }, [data]);

  return (
    <div className="max-w-sm m-2 p-6 gap-4 justify-center flex-col flex border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800">
  
    <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Traffic Overview</h5>
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
        <button 
            type="button"
            onClick={() => setOpenModal(true)}
            data-tooltip-target="data-tooltip"
            data-tooltip-placement="bottom" 
            className="hidden sm:inline-flex items-center justify-center text-gray-500 w-8 h-8 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm">
          <IconExpand />
        </button>
        </div>
    </div>
  
    {/* <Chart options={chartData.options} series={chartData.series} type="donut" width="320" /> */}
    <Chart options={clickData.options} series={clickData.series} type="scatter" height={280} width={320} />
    {/* <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mb-10">

    </div> */}

      <Modal dismissible size='4xl' show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Traffic Overview (per site/app)</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center space-y-6 justify-center">
            {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
              companies around the world are updating their terms of service agreements to comply.
            </p> */}
            <Chart className="dark:background-gray-500 border-2 border-slate-400 dark:border-slate-500 rounded-xl p-6" options={clickData.options} series={clickData.series} type="scatter" height={420} width={700} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>

  </div>
  );
}


function generateDayWiseTimeSeries(startTime, count, options) {
  const { min, max } = options;
  var series = [];
  let i =0;
  while (i < count) {
    var x = startTime;
    var y =
      Math.floor(Math.random() * (max - min + 1)) + min;

    series.push([x, y]);
    startTime += 86400000;
    i++;
  }
  // console.log(series);
  return series;
}
