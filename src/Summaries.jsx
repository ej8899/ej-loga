
'use client';
import { useState, useEffect } from 'react';
import TrafficChart from './TrafficChart';
import VisitorChart from './VisitorChart';
import ServerChart from './ServerChart';
import LogChart from './LogChart';
import ServerSummary from './ServerSummary';

const defaultData = {
  python_version: "3.6.8 (default, Nov 14 2023, 16:29:52) \n[GCC 4.8.5 20150623 (Red Hat 4.8.5-44)]",
  log_file_size: 1,
  log_total_entries: 1,
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
          console.log('fetched summary data')
          setData(jsonData);
        } else {
          console.error('Failed to fetch data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);



  return (
    <div>
    <ServerSummary data={data.python_version} />

    <div className="flex flex-wrap justify-center ">
    
    <LogChart data={data} className="m-4" />
    
    <ServerChart data={data} className="m-4" />
  
    <TrafficChart data={data} className="m-4" />
  
    <VisitorChart data={data} className="m-4" />
  
  </div>
  </div>
  );
}
