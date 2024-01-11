
'use client';
import { useState, useEffect } from 'react';

import { Button, Spinner } from 'flowbite-react';
import { Table, Dropdown } from 'flowbite-react';
import { Label, Tooltip } from 'flowbite-react';

import logger from './logger';

// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all

// TODO - colorize log messages based on type INFO, ERROR, FATAL etc.


export default function Ourdata() {
  const [jsonData, setJsonData] = useState(null);
  const [selectedMessageType, setSelectedMessageType] = useState('all');
  const [visibleItems, setVisibleItems] = useState(20); // Initial number of items to display
  const [messageTypeCounts, setMessageTypeCounts] = useState({}); // State to store message type counts
  const [loadMoreCount, setLoadMoreCount] = useState(1); // New state to track load more count
  const [bookmarkedEntries, setBookmarkedEntries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  

  let loadMoreButton = true;

  useEffect(() => {
    // load data from API
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
        //setFilteredData(data.reverse());
        setSelectedMessageType('all');
        //setFilteredData(data.reverse());

        setVisibleItems((prevVisibleItems) => Math.min(prevVisibleItems, data.length));
        // console.log("SAMPLE:",data[0])
        // console.log("Data Size: ", dataSizeInKB.toFixed(2), " KB");
        logger.info('fetched data - ' + dataSizeInKB.toFixed(2) + " KB");
      } catch (error) {
        console.error("Error fetching data:", error.message);
        logger.error('error fetching data');
      }
    };

    // load bookmarked entries
    const storedBookmarks = localStorage.getItem('bookmarkedEntries');
    if (storedBookmarks) {
      setBookmarkedEntries(JSON.parse(storedBookmarks));
    }

    fetchData();
  }, []);

  // useEffect(() => {
  //   // Calculate message type counts when jsonData changes
  //   if (jsonData) {
  //     const counts = jsonData.reduce((accumulator, row) => {
  //       const messageType = getMessageType(row.log);
  //       accumulator[messageType] = (accumulator[messageType] || 0) + 1;
  //       return accumulator;
  //     }, {});
  //     setMessageTypeCounts(counts);
  //   }
  // }, [jsonData]);

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
    if((loadMoreCount * 20) > jsonData.length) {
      loadMoreButton = false;
      return;
    }
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 20);
    setLoadMoreCount((prevCount) => prevCount + 1);
    //console.log('load more count:',loadMoreCount)
  };

  // const handleMessageTypeChange = (event) => {
  //   // console.log("event.target.value:", event.target.value);
  //   if((20) > filteredData.length) {
  //     loadMoreButton = false;
  //   } else {
  //     loadMoreButton = true;
  //   }
    
  //   setVisibleItems(20);
  //   setLoadMoreCount(1);
  //   setSelectedMessageType(event.target.value);
  //   console.log(loadMoreButton)
  // };

  const handleMessageTypeChange = (event) => {
    if ((20) > filteredData.length) {
      loadMoreButton = false;
    } else {
      loadMoreButton = true;
    }

    setSelectedMessageType(event.target.value);
    setVisibleItems(20);
    setLoadMoreCount(1);

    const selectedType = event.target.value;

    if (selectedType === 'bookmarks') {
      setFilteredData(bookmarkedEntries.map(date => jsonData.find(row => row.date === date)));
    } else {
      setFilteredData(
        jsonData
          ? selectedType === 'all'
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
                  return row.log.includes(messageTypePrefixes[selectedType]);
                })
                .slice(0, visibleItems)
          : []
      );
    }
  };

  // const filteredData = jsonData
  // ? selectedMessageType === 'all'
  //   ? jsonData.slice(0, visibleItems)
  //   : jsonData
  //       .filter((row) => {
  //         const messageTypePrefixes = {
  //           error: '[ERROR]',
  //           warn: '[WARN]',
  //           trace: '[TRACE]',
  //           debug: '[DEBUG]',
  //           info: '[INFO]',
  //           fatal: '[FATAL]',
  //         };
  //         return row.log.includes(messageTypePrefixes[selectedMessageType]);
  //       })
  //       .slice(0, visibleItems)
  // : [];


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
      '[DEBUG]': 'text-blue-400',
      // '[INFO]': 'text-green-500',
      '[FATAL]': 'text-red-500',
    };
  
    let cleanedMessage = logMessage;

    for (const [messageType, style] of Object.entries(messageTypeStyles)) {
      if (logMessage.includes(messageType)) {
        cleanedMessage = cleanedMessage.replace(messageType, '');
        return `<span class='${style}'>${cleanedMessage}</span>`;
      }
    }
  
    return cleanedMessage;
  };

  const renderPill = (log) => {
    let style = '', text ="";
    if (log.includes('[ERROR]')) {
      style = "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300";
      text = "error";
    }
    if (log.includes('[WARN]'))  {
      style = "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300";
      text = "warning";
    }
    if (log.includes('[TRACE]'))  {
      style = "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300";
      text = "trace";
    }
    if (log.includes('[DEBUG]')) return 'debug';
    if (log.includes('[INFO]')) {
      style = "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300";
      text = "info";
    }
    if (log.includes('[FATAL]')) return 'fatal';

    return (
      <span className={`uppercase ${style}`}>{text}</span>
    );
  };
  
  // const isEndOfFile = visibleItems >= filteredData.length;


  const saveBookmarksToLocalStorage = (bookmarks) => {
    localStorage.setItem('bookmarkedEntries', JSON.stringify(bookmarks));
  };

  const handleBookmarkClick = (date) => {
  const updatedBookmarks = isBookmarked(date)
      ? bookmarkedEntries.filter((entry) => entry !== date)
      : [...bookmarkedEntries, date];
    setBookmarkedEntries(updatedBookmarks);
    saveBookmarksToLocalStorage(updatedBookmarks);
  };

  const isBookmarked = (date) => bookmarkedEntries.includes(date);

  
  return (
    <div className="flex flex-col justify-center items-center">
    <div className='max-w-screen-2xl w-full' >
      
      <div className="w-1/4 flex items-center justify-between rounded-lg shadow-lg p-4 border border-slate-600  shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-2 mb-2 ">
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
            <Dropdown.Item value="bookmarks" onClick={() => handleMessageTypeChange({ target: { value: 'bookmarks' } })}>
              Bookmarks ({bookmarkedEntries.length})
            </Dropdown.Item>
            </Dropdown>
      </div>

      {jsonData ? (
        filteredData.length > 0 ? (
        <Table hoverable className=''>
          <Table.Head className='bg-slate-500 dark:bg-gray-800'>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
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
                <Table.Cell>{renderPill(row.log)}</Table.Cell>
                <Table.Cell dangerouslySetInnerHTML={{ __html: cleanLogMessage(row.log) }} />
                <Table.Cell>{truncateUserId(row.userId)}</Table.Cell>
                <Table.Cell>{renderCellValue(row.environment)}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center space-x-1">
                    <Tooltip content="Delete entry (disabled)">
                      <button>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white hover:text-orange-700 dark:hover:text-orange-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"/>
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip content="Bookmark for review">
                      <button onClick={() => handleBookmarkClick(row.date)}>
                      {isBookmarked(row.date) ? (
                          <svg className="mr-4 ml-4 w-6 h-6 text-orange-700 dark:text-orange-400 m-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 14 20">
                          <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z"/>
                        </svg>
                        ) : (
                          <svg className="mr-4 ml-4 w-6 h-6 text-gray-800 dark:text-white hover:text-orange-700 dark:hover:text-orange-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z"/>
                          </svg>
                      )}
                      </button>
                    </Tooltip>
                    <Tooltip content="Archive this entry (disabled)">
                      <button>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white hover:text-orange-700 dark:hover:text-orange-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1" d="M8 8v1h4V8m4 7H4a1 1 0 0 1-1-1V5h14v9a1 1 0 0 1-1 1ZM2 1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z"/>
                        </svg>
                    </button>
                    </Tooltip>
                  </div>
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
              className="p-2 rounded-xl bg-blue-500 text-white"
            >
              Load More...
            </button>
          </div>
        )}
      
    </div>
    </div>
  );
}