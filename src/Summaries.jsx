
'use client';

import TrafficChart from './TrafficChart';
import VisitorChart from './VisitorChart';
import ServerChart from './ServerChart';
import LogChart from './LogChart';

export default function Summaries() {
  return (
    <div className="flex justify-end space-x-4">

      <LogChart/>
      
      <ServerChart/>

      <TrafficChart/>

      <VisitorChart/>

    </div>
  );
}
