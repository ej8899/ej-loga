/* eslint-disable react/prop-types */

'use client';
import { Button, Tooltip } from 'flowbite-react';
import version from './version.json';

// set this to monitor # of hours in the log to watch for any cautionary items
const HOURS_FOR_WARNINGS = 12;



function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(4, '0'); // Ensure 4-digit padding
  const formattedTimestamp = `${year}-${month}-${day}//${minute}`;
  return formattedTimestamp;
}
const formattedBuild = formatTimestamp(version.buildDate);

export default function ServerSummary({data, errorDates}) {
  const [pythonVersion, osInfo] = data.split('\n');
  
  // console.log('errorDates via props:',errorDates)
  // check for any server errors/warnings/fatals and update server status accordingly
  const hasWarning = Object.values(errorDates).some(date => {
    if (date) {
      const errorDate = new Date(date);
      const diffInMs = new Date() - errorDate;
      const diffInHours = diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
      return diffInHours <= HOURS_FOR_WARNINGS; 
    }
    return false;
  });

  const tooltipContent = hasWarning ? "Warnings within 24 hours" : "No warnings within 24 hours";

  return (
    <div className="flex flex-col justify-center items-center w-full">
    <div className="max-w-screen-2xl w-full">
      <div className="flex items-center justify-between rounded-xl shadow-lg p-4 border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white m-1">
        <div className="flex items-center">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gcc/gcc-original.svg" width='54' className='' />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width='54' className='' />
          <div className="mx-4">
            <p>Python Version: <span className="text-gray-600 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-400">{pythonVersion}</span></p>
            <p>GNU Compiler Collection: <span className="text-gray-600 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-400">{osInfo}</span></p>
            <p>Build Version: <span className="text-gray-600 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-400">{formattedBuild}</span></p>
            {/* <p>warn: <span className="text-gray-600 dark:text-gray-400 hover:text-orange-700 dark:hover:text-orange-400">{errorDates.WARN}</span></p> */}
          </div>
        </div>

        <Tooltip content={tooltipContent}>
        <Button color={hasWarning ? "purple" : "success"} pill className="cursor-default">
              {hasWarning ? "Caution" : "Operating OK"}
            </Button>
        </Tooltip>  
      </div>
      
    </div>
  </div>
);
}
