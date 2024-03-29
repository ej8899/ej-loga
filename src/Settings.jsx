/* eslint-disable react/prop-types */

'use client';
import { useState } from 'react';
import { Button, Tooltip, Accordion } from 'flowbite-react';

// TODO - continue building this out - actually read the server settings to allow for updates once logged in

export default function ServerSettings({ data }) {
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(false);
  const [switch4, setSwitch4] = useState(false);

  const handleSwitch1Change = () => {
    setSwitch1((prevSwitch1) => !prevSwitch1);
  };

  const handleSwitch2Change = () => {
    setSwitch2((prevSwitch2) => !prevSwitch2);
  };

  const handleSwitch3Change = () => {
    setSwitch3((prevSwitch3) => !prevSwitch3);
  };

  const handleSwitch4Change = () => {
    setSwitch4((prevSwitch4) => !prevSwitch4);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="max-w-screen-2xl w-full">
      <Accordion collapseAll className="flex flex-col rounded-xl p-2 shadow-lg border border-slate-600 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white m-1 ">
      <Accordion.Panel className=' bg-white dark:bg-gray-800'>
        <Accordion.Title className=' p-2'>
          <div className="text-lg text-gray-900 dark:text-white ">Settings...</div>
        </Accordion.Title>
        <Accordion.Content className="dark:bg-grey" >
          <div className="flex flex-row gap-4 w-full">
            <table>
              <tbody>
              <tr>
                <td className='p-2'>Local Settings...</td>
                <td>
                  <label className="relative inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    checked={switch4}
                    className="sr-only peer"
                    onChange={handleSwitch4Change}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">show local time</span>
                  </label>
                </td>
              </tr>

              <tr>
                <td className='p-2'>Admin Settings...</td>
                <td>
                  <label className="relative inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    checked={switch1}
                    className="sr-only peer"
                    onChange={handleSwitch1Change}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">email on alerts</span>
                </label>

                <label className="relative inline-flex items-center me-5 cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    checked={switch2}
                    className="sr-only peer"
                    onChange={handleSwitch2Change}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">auto archive events</span>
                  </label>   
                </td>
              </tr>

              <tr>
                <td className='p-2 pr-8'>Server Admin Settings...</td>
                <td>
                  <label className="relative inline-flex items-center me-5 cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      checked={switch3}
                      className="sr-only peer"
                      onChange={handleSwitch3Change}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">archive NOW</span>
                  </label>
                </td>
              </tr>
            </tbody>
            </table>
                      
            </div>

            <div className="flex flex-row justify-end">
              <Tooltip content="not logged in">
                <Button disabled>save</Button>
              </Tooltip>
            </div>
        </Accordion.Content>
      </Accordion.Panel>
      </Accordion>
  
      </div>
    </div>
  );
}
