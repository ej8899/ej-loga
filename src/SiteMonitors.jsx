/* eslint-disable react/prop-types */

'use client';
import { Button, Tooltip } from 'flowbite-react';
import version from './version.json';

import { useState, useEffect } from 'react';

// set this to monitor # of hours in the log to watch for any cautionary items
const HOURS_FOR_WARNINGS = 12;
const HOURS_FOR_ERRORS = 2;
//
// TODO - red is within 1 hour errors, orange within 12 hrs, green > 12 hrs

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(4, '0'); // Ensure 4-digit padding
  const formattedTimestamp = `${year}-${month}-${day}//${minute}`;
  return formattedTimestamp;
}


export default function SiteMonitors({data}) {
  const { site_monitors, site_total_counts } = data; // Destructure for clarity
  const [combinedMonitors, setCombinedMonitors] = useState({...site_monitors});


  useEffect(() => {
    const updateCombinedMonitors = () => {
      if (!site_total_counts) return; // Check if site_total_counts is undefined or null
    
      const updatedMonitors = { ...site_monitors };
      updatedMonitors['YTAB'] = {
        event_type: "ERROR",
        message: "[ERROR] [YTAB] wx api fail",
        date: "2025-02-11T12:54:12.949Z"
      };
      updatedMonitors['WX-WINDSOR'] = {
        event_type: "ERROR",
        message: "[ERROR] [YTAB] wx api fail",
        date: "2024-02-11T13:54:12.949Z"
      };
      updatedMonitors['KIOSK-private01'] = {
        event_type: "available",
        message: "[INFO] showing dashboard page",
        date: "2024-02-11T14:54:12.949Z"
      };
      updatedMonitors['KIOSK-ejdevs'] = {
        event_type: "available",
        message: "[INFO] showing dashboard page",
        date: "2024-02-11T14:54:12.949Z"
      };
      updatedMonitors['WP-MEETG'] = {
        event_type: "INFO",
        message: "[INFO] all operational",
        date: "2025-02-11T15:54:12.949Z"
      };
      updatedMonitors['T.NETHOST'] = {
        event_type: "FATAL",
        message: "server offline (maintenance)",
        date: "2024-04-11T16:54:12.949Z"
      };
      updatedMonitors['LIB'] = {
        event_type: "available",
        message: "server offline (maintenance)",
        date: "2024-04-11T16:54:12.949Z"
      };
      updatedMonitors['CHATBOT'] = {
        event_type: "available",
        message: "server offline (maintenance)",
        date: "2024-04-11T16:54:12.949Z"
      };
      updatedMonitors['WP-VHACK'] = {
        event_type: "available",
        message: "server offline (maintenance)",
        date: "2024-04-11T16:54:12.949Z"
      };

      Object.keys(site_total_counts).forEach(siteCode => {
        if (!updatedMonitors.hasOwnProperty(siteCode)) {
          updatedMonitors[siteCode] = {
            event_type: "ERROR",
            message: "[ERROR] error fetching data",
            date: "2024-02-11"
          };
        }
      });
    
      setCombinedMonitors(updatedMonitors);
    };

    updateCombinedMonitors();
  }, [site_total_counts, site_monitors]);


  const sortedEntries = Object.entries(combinedMonitors).sort(([a], [b]) => a.localeCompare(b));


  return (
    <div className="flex justify-center items-center w-full">
      <div className="max-w-screen-2xl w-full">
        <div className="flex flex-col  justify-between rounded-xl shadow-lg p-4 border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white m-1">
          <div className="text-lg text-gray-900 dark:text-white pb-2">Site Monitors...</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
          {sortedEntries.map(([siteCode, monitorData]) => (
              <SiteMonitorListItem
                key={siteCode}
                siteCode={siteCode}
                event_type={monitorData.event_type}
                message={monitorData.message}
                date={monitorData.date}
                availability={calculateAvailability(monitorData.date)}
              />
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}


function SiteMonitorListItem({ siteCode, event_type, message, date, availability }) {
  // const availabilityStatus = availability ? 'available' : 'errors';
  // const availabilityClass = availability
  //   ? 'bg-green-300 text-green-800 dark:bg-green-900 dark:text-green-300'
  //   : 'bg-orange-300 text-orange-800 dark:bg-orange-600 dark:text-orange-300';

  // const availabilityIconClass = availability ? 'bg-green-500' : 'bg-orange-500';

  let availabilityStatus = '';
  let availabilityClass = '';
  let availabilityIconClass = '';

  // Set availability status, class, and icon class based on prop
  if ((event_type === 'WARN' || event_type === 'FATAL' || event_type === 'ERROR') && availability === 'errors') {
    availabilityStatus = 'Errors';
    availabilityClass = 'bg-red-300 text-yellow-800 dark:bg-red-900 dark:text-yellow-300';
    availabilityIconClass = 'bg-red-500';
  } else if ((event_type === 'WARN' || event_type === 'FATAL' || event_type === 'ERROR') && availability === 'warnings') {
    availabilityStatus = 'Warnings';
    availabilityClass = 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    availabilityIconClass = 'bg-orange-500';
  } else if (availability === 'available') {
    availabilityStatus = 'Available';
    availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300';
    availabilityIconClass = 'bg-green-500';
  } else {
    // Default to unknown state if none of the conditions are met
    availabilityStatus = 'available';
    availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300';
    availabilityIconClass = 'bg-green-500';
  }



  return (
    <li className="py-3 sm:py-4 flex items-center space-x-3 rtl:space-x-reverse p-2 border border-slate-600 rounded-xl shadow-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
          {siteCode}
        </p>
        {(event_type === 'WARN' || event_type === 'FATAL' || event_type === 'ERROR') &&
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {message}
          </p>
        }
      </div>
      <span className={`inline-flex items-center ${availabilityClass} text-xs font-medium px-2.5 py-0.5 rounded-full uppercase`}>
        <span className={`w-2 h-2 me-2 ${availabilityIconClass} rounded-full`}></span>
        {availabilityStatus}
      </span>
    </li>
  );
}

function calculateAvailability(monitorDate) {
  const currentTime = new Date();
  const monitorTime = new Date(monitorDate);
  const timeDifference = (currentTime - monitorTime) / (1000 * 60 * 60); // Difference in hours
  
  if (timeDifference < HOURS_FOR_ERRORS) {
    return 'errors';
  } else if (timeDifference < HOURS_FOR_WARNINGS) {
    return 'warnings';
  } else {
    return 'available';
  }
}