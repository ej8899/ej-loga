
'use client';
import { useState, useEffect } from 'react';

import { Spinner } from 'flowbite-react';
import { Table } from 'flowbite-react';
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
    console.log("event.target.value:", event.target.value);
    setSelectedMessageType(event.target.value);
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
    if (logMessage.includes('[ERROR]')) {
      const cleanedMessage = `<span class='text-red-500'>${logMessage}</span>`;
      return cleanedMessage;
    } else if (logMessage.includes('[WARN]')) {
      const cleanedMessage = `<span class='text-orange-500'>${logMessage}</span>`;
      return cleanedMessage;
    } else {
      return logMessage;
    }
  }

  return (
    <div className="overflow-x-auto">
      
      <div className="mb-4">
        <Label htmlFor="messageType" value="Filter Log Message Types:" className="mr-2" />
        <select
          id="messageType"
          value={selectedMessageType}
          onChange={handleMessageTypeChange}
          className="p-2 border rounded"
        >
        <option value="all">All ({jsonData ? jsonData.length : 0})</option>
          {Object.keys(messageTypeCounts)
            .sort()
            .map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)} ({messageTypeCounts[type]})
              </option>
            ))}
        </select>
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

      {jsonData && filteredData.length < jsonData.length && (
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