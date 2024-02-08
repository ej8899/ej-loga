
'use client';
import { useState, useEffect } from 'react';
import TrafficChart from './TrafficChart';
import VisitorChart from './VisitorChart';
import ServerChart from './ServerChart';
import LogChart from './LogChart';
import ServerSummary from './ServerSummary';
import ServerSettings from './Settings';
import SiteTraffic from './SiteTraffic';

//
// stats summary API: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=stats
// raw data API: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all
//
const defaultData = {
  python_version: "3.6.8 (default, Nov 14 2023, 16:29:52) \n[GCC 4.8.5 20150623 (Red Hat 4.8.5-44)]",
  log_file_size: 1,
  log_total_entries: 1,
  error_dates: {
    "WARN": "2024-01-08T12:50:16.006485",
    "ERROR": "2024-01-14T19:54:12.949Z",
    "FATAL": null
  },
  log_levels_count: {
    WARN: 20,
    INFO: 20,
    ERROR: 20,
    FATAL: 20,
    DEBUG: 10,
    TRACE: 10
  },
  unique_visitors: 1,
  environment_summary: [
    {
      Desktop: 60,
      Mobile: 40
    },
    {
      MacIntel: 33,
      iPad: 13,
      iPhone: 10,
      Win32: 36,
      'Linux armv81': 6,
      'Linux armv8l': 13,
      'Linux x86_64': 4
    },
    {
      Chrome: 5,
      Safari: 3
    }
  ],
  date_counts: {
    "2023-12-30": 1,
    "2023-12-31": 2,
    "2024-01-01": 1,
    "2024-01-02": 2,
    "2024-01-03": 1,
    "2024-01-04": 2,
    "2024-01-05": 1,
    "2024-01-06": 2
  }
};

export default function Summaries() {
  const [data, setData] = useState(defaultData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=stats');

        if (response.ok) {
          const jsonData = await response.json();

          // Sort the date_counts data
          const sortedDateCounts = Object.fromEntries(
            Object.entries(jsonData.date_counts).sort((a, b) => new Date(a[0]) - new Date(b[0]))
          );

          // Update the state with sorted data
          setData({
            ...jsonData,
            date_counts: sortedDateCounts,
          });
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);
console.log('raw data:',data)
  console.log("error dates (summaries):",data.error_dates)

  return (
    <div className='flex flex-col items-center'>
    <ServerSummary data={data.python_version} errorDates={data.error_dates} />
    <ServerSettings />
      <div className="flex flex-wrap justify-center w-5/6 ">
      <LogChart data={data} className="m-4" />
      
      <ServerChart data={data} className="m-4" />
    
      <TrafficChart data={data} className="m-4" />
    
      <VisitorChart data={data} className="m-4" />
      {/* <br />
      <SiteTraffic data={data} className="m-4" /> */}

      </div>

    </div>
  );
}
