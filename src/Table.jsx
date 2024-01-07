
'use client';
import { useState, useEffect } from 'react';

import { Spinner } from 'flowbite-react';
import { Table, Dropdown } from 'flowbite-react';
import { Label,  } from 'flowbite-react';

import logger from './logger';

// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all

// TODO - colorize log messages based on type INFO, ERROR, FATAL etc.


export default function Ourdata() {
  const [jsonData, setJsonData] = useState(null);
  const [selectedMessageType, setSelectedMessageType] = useState('all');
  const [visibleItems, setVisibleItems] = useState(20); // Initial number of items to display
  const [messageTypeCounts, setMessageTypeCounts] = useState({}); // State to store message type counts


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const data = await response.json();

        // Retrieve the Content-Length header from the response
        // const contentLengthHeader = response.headers.get("Content-Length");
        const jsonString = JSON.stringify(data);
        const dataSizeInBytes = new Blob([jsonString]).size;        
        // const dataSizeInBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
        const dataSizeInKB = dataSizeInBytes / 1024;
        
        setJsonData(data.reverse());
        setVisibleItems((prevVisibleItems) => Math.min(prevVisibleItems, data.length));
        // console.log("SAMPLE:",data[0])
        // console.log("Data Size: ", dataSizeInKB.toFixed(2), " KB");
        logger.info('(loga) fetched data - ' + dataSizeInKB.toFixed(2) + " KB");
      } catch (error) {
        console.error("Error fetching data:", error.message);
        logger.error('(loga) error fetching data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Calculate message type counts when jsonData changes
    if (jsonData) {
      const counts = jsonData.reduce((accumulator, row) => {
        const messageType = getMessageType(row.log);
        accumulator[messageType] = (accumulator[messageType] || 0) + 1;
        return accumulator;
      }, {});
      setMessageTypeCounts(counts);
    }
  }, [jsonData]);

  const getMessageType = (log) => {
    if (log.includes('[ERROR]')) return 'error';
    if (log.includes('[WARN]')) return 'warn';
    if (log.includes('[TRACE]')) return 'trace';
    if (log.includes('[DEBUG]')) return 'debug';
    if (log.includes('[INFO]')) return 'info';
    if (log.includes('[FATAL]')) return 'fatal';
    return 'unknown';
  };


  const handleLoadMore = () => {
    // Increase visible items by 20 on each "Load More" click
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 20);
  };

  const handleMessageTypeChange = (event) => {
    // console.log("event.target.value:", event.target.value);
    setSelectedMessageType(event.target.value);
    setVisibleItems(filteredData.length);
    console.log('vis items',filteredData.length)
  };

  const filteredData = jsonData
  ? selectedMessageType === 'all'
    ? jsonData.slice(0, visibleItems)
    : jsonData
        .filter((row) => {
          const messageTypePrefixes = {
            error: '[ERROR]',
            warn: '[WARN]',
            trace: '[TRACE]',
            debug: '[DEBUG]',
            info: '[INFO]',
            fatal: '[FATAL]',
          };
          return row.log.includes(messageTypePrefixes[selectedMessageType]);
        })
        .slice(0, visibleItems)
  : [];


  const truncateUserId = (userId) => {
    const maxLength = 10;
    return userId.length > maxLength ? `...${userId.slice(-maxLength)}` : userId;
  };

  const renderCellValue = (value) => {
    if (typeof value === 'object') {
      // If the value is an object, display its properties
      return Object.keys(value).map((key) => (
        <div key={key}>
          <strong>{key}:</strong> {value[key]}
        </div>
      ));
    }
    // Otherwise, display the value as-is
    return value;
  };

  const cleanLogMessage = (logMessage) => {
    const messageTypeStyles = {
      '[ERROR]': 'text-red-500',
      '[WARN]': 'text-orange-500',
      '[TRACE]': 'text-blue-700',
    };
  
    for (const [messageType, style] of Object.entries(messageTypeStyles)) {
      if (logMessage.includes(messageType)) {
        return `<span class='${style}'>${logMessage}</span>`;
      }
    }
  
    return logMessage;
  };
  
  const isEndOfFile = visibleItems >= filteredData.length;
  console.log('end of file:',isEndOfFile)
  console.log('filtered data length:', filteredData.length);
  console.log('visible items:', visibleItems);

  return (
    <div className="overflow-x-auto">
      
      <div className="mb-4">
        <Label htmlFor="messageType" value="Filter Log Message Types:" className="mr-2" />
        <Dropdown 
              label="" 
              dismissOnClick={true} 
              renderTrigger={() => <span className="text-md font-medium text-blue-700 dark:text-gray-400 hover:text-orange-500 text-center inline-flex items-center dark:hover:text-white"
              >
                {selectedMessageType} <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg></span>} className="py-2 text-sm text-gray-700 dark:text-gray-200">
              {/* <Dropdown.Item onClick={() => handleItemClick(6)}>Last 365 days</Dropdown.Item> */}
              <Dropdown.Item value="all" onClick={() => handleMessageTypeChange({ target: { value: 'all' } })}>All ({jsonData ? jsonData.length : 0})</Dropdown.Item>
          {Object.keys(messageTypeCounts)
            .sort()
            .map((type) => (
              <Dropdown.Item key={type} value={type} onClick={() => handleMessageTypeChange({ target: { value: type } })}>
                {type.charAt(0).toUpperCase() + type.slice(1)} ({messageTypeCounts[type]})
              </Dropdown.Item>
            ))}
            </Dropdown>
      </div>

      {jsonData ? (
        filteredData.length > 0 ? (
        <Table hoverable>
          <Table.Head className='bg-slate-500 dark:bg-gray-800'>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Log Message</Table.HeadCell>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>Environment</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredData.slice().map((row, rowIndex) => (
              <Table.Row
                key={rowIndex}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {row.date}
                </Table.Cell>
                <Table.Cell dangerouslySetInnerHTML={{ __html: cleanLogMessage(row.log) }} />
                <Table.Cell>{truncateUserId(row.userId)}</Table.Cell>
                <Table.Cell>{renderCellValue(row.environment)}</Table.Cell>
                <Table.Cell>
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    delete
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        ) : (
          <div className="text-center">
            <p>No matching data found.</p>
          </div>
        )
      ) : (
        <div className="text-center">
          <Spinner aria-label="Loading log data..." size="xl" />
          <br />
          Loading Data...
        </div>
      )}

        {jsonData && (
          <div className="text-center mt-4">
            <button
              onClick={handleLoadMore}
              className="p-2 rounded bg-blue-500 text-white"
            >
              Load More...
            </button>
          </div>
        )}
      
    </div>
  );
}