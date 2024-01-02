
'use client';

import { Card } from 'flowbite-react';
import TrafficChart from './TrafficChart';

export default function Summaries() {
  return (
    <div className="flex justify-end space-x-4">

      <TrafficChart/>

      <Card href="#" className="max-w-sm">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Unique Visitors
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          loreum ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Repeat Visitors
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          loreum ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
      </Card>

      <Card href="#" className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Visits/Day (last 30 days)
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        loreum ipsum dolor sit amet, consectetur adipisicing elit.
      </p>
      </Card>
    </div>
  );
}
