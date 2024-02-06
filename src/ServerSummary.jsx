/* eslint-disable react/prop-types */

'use client';
import { Button, Tooltip } from 'flowbite-react';
import version from './version.json';

// TODO - if warnings within 24hours - change button to orange w. CAUTION

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

export default function ServerSummary({data}) {
  const [pythonVersion, osInfo] = data.split('\n');
  
  return (
    <div className="flex flex-col justify-center items-center">
    <div className="max-w-screen-2xl w-full">
      <div className="flex items-center justify-between rounded-xl shadow-lg p-4 border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white m-1">
        <div className="flex items-center">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gcc/gcc-original.svg" width='54' className='' />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width='54' className='' />
          <div className="mx-4">
            <p>Python Version: {pythonVersion}</p>
            <p>GNU Compiler Collection: {osInfo}</p>
            <p>Build Version: <span className="text-grey-400 dark:text-grey-400">{formattedBuild}</span></p>
          </div>
        </div>

        <Tooltip content="(no errors within 24hrs)">
        <Button color="success" pill className="cursor-default">
          Operating OK
        </Button>
        </Tooltip>  
      </div>
      
    </div>
  </div>
);
}
