
'use client';
import { useState, useEffect } from 'react';
import TrafficChart from './TrafficChart';
import VisitorChart from './VisitorChart';
import ServerChart from './ServerChart';
import LogChart from './LogChart';

export default function Summaries() {
  const [data, setData] = useState(null);

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
    <div className="flex justify-end space-x-4">

      <LogChart data={data}/>
      
      <ServerChart data={data}/>

      <TrafficChart data={data}/>

      <VisitorChart data={data}/>

    </div>
  );
}
