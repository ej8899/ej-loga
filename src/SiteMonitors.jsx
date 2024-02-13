/* eslint-disable react/prop-types */

'use client';
import { useState, useEffect } from 'react';
import { Button, Tooltip, Accordion } from 'flowbite-react';

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
        event_type: "WARN",
        message: "[ERROR] [YTAB] wx api fail",
        date: "2025-02-11T12:54:12.949Z"
      };
      updatedMonitors['WX-WINDSOR'] = {
        event_type: "INFO",
        message: "[WARN] [YTAB] wx api fail",
        date: "2024-02-12T13:54:12.949Z"
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
        event_type: "offline",
        message: "server offline (maintenance)",
        date: "2024-04-11T16:54:12.949Z"
      };
      updatedMonitors['LINKINBIO'] = {
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
      updatedMonitors['CQUIZ'] = {
        event_type: "offline",
        message: "(local only)",
        date: "2030-04-11T16:54:12.949Z"
      };

      Object.keys(site_total_counts).forEach(siteCode => {
        if (!updatedMonitors.hasOwnProperty(siteCode)) {
          updatedMonitors[siteCode] = {
            event_type: "INFO",
            message: "[INFO] operating with no errors",
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
    <div className="flex flex-col justify-center items-center w-full">
      <div className="max-w-screen-2xl w-full">
      <Accordion  className="flex flex-col rounded-xl p-2 shadow-lg border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white m-1">
      <Accordion.Panel className='bg-white dark:bg-gray-800 p-0 m-0'>
        <Accordion.Title className='p-2'>
          <div className="text-lg text-gray-900 dark:text-white ">Site Monitors...</div>
        </Accordion.Title>
        <Accordion.Content className="dark:bg-grey p-2 pt-4 m-0">
          <div className="flex flex-row gap-4 w-full m-0 p-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {sortedEntries.map(([siteCode, monitorData]) => (
                <SiteMonitorListItem
                  key={siteCode}
                  siteCode={siteCode}
                  event_type={monitorData.event_type}
                  message={monitorData.message}
                  date={monitorData.date}
                  availability={calculateAvailability(monitorData.event_type, monitorData.date)}
                />
              ))}
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Panel>
      </Accordion>
  
      </div>
    </div>
  );
}


function SiteMonitorListItem({ siteCode, event_type, message, date, availability }) {
  const strippedMessage = message.replace(/\[(.*?)\]/g, '');
  let availabilityStatus = '';
  let availabilityClass = '';
  let availabilityIconClass = '';

  // Set availability status, class, and icon class based on prop
  if ((event_type === 'FATAL' || event_type === 'ERROR') && availability === 'errors') {
    availabilityStatus = 'Error';
    availabilityClass = 'bg-red-300 text-yellow-800 dark:bg-red-900 dark:text-yellow-300';
    availabilityIconClass = 'bg-red-500';
  } else if ((event_type === 'WARN') && (availability === 'warnings' || availability === 'errors')) {
    availabilityStatus = 'Warning';
    availabilityClass = 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    availabilityIconClass = 'bg-orange-500';
  } else if (availability === 'offline') {
    availabilityStatus = 'offline';
    availabilityClass = 'bg-slate-200 text-slate-800 dark:bg-slate-900 dark:text-slate-300';
    availabilityIconClass = 'bg-slate-500';
  } else {
    // Default to unknown state if none of the conditions are met
    availabilityStatus = 'Available';
    availabilityClass = 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300';
    availabilityIconClass = 'bg-green-500';
  }



  return (
    <div className="py-3 sm:py-4 flex items-center space-x-3 rtl:space-x-reverse p-2 border border-slate-600 rounded-xl shadow-lg">
      <div className="flex-1 min-w-0 border-0">
        <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
          {siteCode}
        </p>
        {(['ERROR', 'WARN', 'FATAL'].includes(event_type) && (availability === 'errors' || availability === 'warnings')) || availability === 'offline' ?
        (
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {strippedMessage}
          </p>
        ) : (
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            status all normal
          </p>
        )
      }

      </div>
      <span className={`inline-flex items-center ${availabilityClass} text-xs font-medium px-2.5 py-0.5 rounded-full uppercase`}>
        <span className={`w-2 h-2 me-2 ${availabilityIconClass} rounded-full`}></span>
        {availabilityStatus}
      </span>
    </div>
  );
}

function calculateAvailability(event_type, monitorDate) {
  if (event_type === 'offline') {
    return 'offline';
  }

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
