
'use client';
import { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';

export default function ServerSummary({data}) {
  const [pythonVersion, osInfo] = data.split('\n');
  
  return (
    <div className="flex flex-col justify-center items-center">
    <div className="max-w-screen-2xl w-full">
      <div className="flex justify-between bg-slate-500 dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white m-1">
        <div className="flex items-center">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gcc/gcc-original.svg" width='54' className='' />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width='54' className='' />
          <div className="mx-4">
            <p>Python Version: {pythonVersion}</p>
            <p>GNU Compiler Collection: {osInfo}</p>
          </div>
        </div>

        <Button color="success" pill>
          Operating
        </Button>
      </div>
    </div>
  </div>
);
}
