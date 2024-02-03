
'use client';
import { useState, useEffect } from 'react';

import { Button, Spinner, } from 'flowbite-react';
import { Table, Dropdown } from 'flowbite-react';
import { Label, Tooltip } from 'flowbite-react';
import { HiOutlineArrowDown,  } from 'react-icons/hi';

import logger from './logger';

// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all

// TODO - colorize log messages based on type INFO, ERROR, FATAL etc.



export default function Ourdata() {
  const [jsonData, setJsonData] = useState(null);
  const [selectedMessageType, setSelectedMessageType] = useState('SELECT');
  const [visibleItems, setVisibleItems] = useState(20); // Initial number of items to display
  const [messageTypeCounts, setMessageTypeCounts] = useState({}); // State to store message type counts
  const [loadMoreCount, setLoadMoreCount] = useState(1); // New state to track load more count
  const [bookmarkedEntries, setBookmarkedEntries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoadMoreVisible, setLoadMoreVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);

  let numPages = 100;

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

        const invalidRecords = data.filter((row) => !row.date || !row.userId);
        if (invalidRecords.length > 0) {
          console.warn('Warning: Records with blank date or userId found:', invalidRecords);
        }
        const sanitizedData = data.filter((row) => row.date && row.userId);

        const jsonString = JSON.stringify(sanitizedData);
        const dataSizeInBytes = new Blob([jsonString]).size;        
        const dataSizeInKB = dataSizeInBytes / 1024;

        setJsonData(sanitizedData.reverse());
        setSelectedMessageType('SELECT');
        setFilteredData(data.reverse());

        setVisibleItems((prevVisibleItems) => Math.min(prevVisibleItems, data.length));
        // console.log("SAMPLE:",data[0])
        // console.log("Data Size: ", dataSizeInKB.toFixed(2), " KB");
        logger.info('fetched data - ' + dataSizeInKB.toFixed(2) + " KB");

        // Log a warning for records with blank date or userId

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

  // useEffect(() => {
  //   // Trigger load more when filteredData changes
  //   //handleLoadMore();
  //   setTotalPages(() => parseInt(filteredData.length/itemsPerPage) + 1);
  //     if(totalPages > 1 ) { 
  //       setLoadMoreVisible(true);
  //     } else {
  //       setLoadMoreVisible(false);
  //     }
  //     //numPages = parseInt(filteredData.length / itemsPerPage) + 1;
  //     //setTotalPages((prevTotalPages) => Math.min(prevVisibleItems, data.length));
  //     console.log('\ntotalPages:',totalPages)

  //     console.log('len jsonData:',jsonData.length)
  //     console.log('len visibleItems:',visibleItems)
  //     console.log('len filteredData:',filteredData.length)
  //     console.log('currentPage:',currentPage)
  // }, [filteredData]);
  


  const getMessageType = (log) => {
    if (log.includes('[ERROR]')) return 'error';
    if (log.includes('[WARN]')) return 'warn';
    if (log.includes('[TRACE]')) return 'trace';
    if (log.includes('[DEBUG]')) return 'debug';
    if (log.includes('[INFO]')) return 'info';
    if (log.includes('[FATAL]')) return 'fatal';
    return 'unknown';
  };

  // const onPageChange = (page) => setCurrentPage(page);
  const onPageChange = (page) => {
    setCurrentPage(page);
    setVisibleItems(page * itemsPerPage); // Adjust visible items based on the current page
  };

  const handleLoadMore = () => {
    
    // console.log('load more clicked');
    // console.log('len jsonData:',jsonData.length)
    // console.log('len visibleItems:',visibleItems)
    // console.log('len filteredData:',filteredData.length)
    // console.log('currentPage:',currentPage)

    const remainingItems = filteredData.length - visibleItems;
    const itemsToLoad = Math.min(itemsPerPage, remainingItems);
  
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    setVisibleItems((prevVisibleItems) => prevVisibleItems + itemsToLoad);
    if (remainingItems <= itemsPerPage) {
      setLoadMoreVisible(false);
    }
  };

  const itemsPerPage = 20;
  const startIndex = 0;
  const endIndex = visibleItems;
  const currentVisibleItems = filteredData.slice(startIndex, endIndex);

  const handleMessageTypeChange = (event) => {
    const selectedType = event.target.value;

    if (selectedType === 'all') {
      setFilteredData(jsonData);
    } else {
      setFilteredData(() => {
        return jsonData
          ? selectedType === 'bookmarks'
            ? jsonData.filter((row) => isBookmarked(row.date))
            : jsonData.filter((row) => {
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
          : [];
      });
    }

    // Reset current page to 1 when changing message type
    setCurrentPage(1);
    setLoadMoreVisible(true); // Reset the visibility of the Load More button
    setSelectedMessageType(selectedType);
  };

  useEffect(() => {
    // Update Load More visibility when filteredData or visibleItems change
    const lessThanItemsPerPage = currentVisibleItems.length < itemsPerPage;
    const allItemsDisplayed = visibleItems >= filteredData.length;
    setLoadMoreVisible(!lessThanItemsPerPage && !allItemsDisplayed);
  }, [filteredData, currentVisibleItems, visibleItems]);


  const truncateUserId = (userId) => {
    if(!userId) return 'uid unknown';
    const maxLength = 10;
    return userId.length > maxLength ? `...${userId.slice(-maxLength)}` : userId;
  };

  const environmentLookup = {
    Chrome: '<i class="fa-brands fa-chrome fa-lg"></i>', 
    Safari: '<i class="fa-brands fa-safari fa-lg"></i>',
    Firefox: '<i class="fa-brands fa-firefox fa-lg"></i>',

    MacIntel: '<i class="fa-brands fa-apple fa-xl"></i>',
    Win32: '<i class="fa-brands fa-windows fa-lg"></i>',
    'Linux x86_64': '<i class="fa-brands fa-linux fa-lg"></i>',
    'Linux armv81': '<i class="fa-brands fa-android fa-lg"></i>',
    'Linux armv8l': '<i class="fa-brands fa-android fa-lg"></i>',

    Desktop: '<i class="fa-solid fa-laptop fa-lg"></i>',
    Mobile: ' ',
    iPhone: '<i class="fa-solid fa-mobile fa-lg"></i>',
    Tablet: '<i class="fa-solid fa-tablet fa-lg"></i>',
    iPad: '<i class="fa-solid fa-tablet fa-lg"></i>'
  };

  const renderCellValue = (value) => {
    if (typeof value === 'object') {
      // If the value is an object - it's our environment details
      return (
        <div className='flex flex-row'>
          {Object.keys(value).map((key) => (
            <div key={key} className='flex items-center p-1' style={{ flex: '1' }}>
              {/* You can customize the styling here */}
              {key === 'version' ? (
                <Tooltip content={`Version: ${value[key]}`} placement='bottom'>
                  <span className='text-xs'>v.{value[key]}</span>
                </Tooltip>
              ) : (
                <Tooltip content={value[key]} placement='bottom'>
                  <div
                    dangerouslySetInnerHTML={{ __html: environmentLookup[value[key]] || value[key] }}
                  />
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      );
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
      '[INFO]': '',
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
        currentVisibleItems.length > 0 ? (
        <Table hoverable className='' >
          <Table.Head className='bg-slate-500 dark:bg-gray-800 '>
            <Table.HeadCell>Row</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Log Message</Table.HeadCell>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>Environment</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y ">
            {currentVisibleItems.slice().map((row, rowIndex) => (
              <Table.Row
                key={rowIndex}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{rowIndex + 1 }</Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {row.date}
                </Table.Cell>
                <Table.Cell>{renderPill(row.log)}</Table.Cell>
                <Table.Cell 
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: cleanLogMessage(row.log) }} 
                />
                <Table.Cell>{truncateUserId(row.userId)}</Table.Cell>
                
                <Table.Cell
                >{renderCellValue(row.environment)}</Table.Cell>
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
          <div className="text-center text-gray-800 dark:text-white">
            <p>No matching data found.</p>
          </div>
        )
      ) : (
        <div className="text-center text-gray-800 dark:text-white">
          <Spinner aria-label="Loading log data..." size="xl" />
          <br />
          Loading Data...
        </div>
      )}

      {jsonData && isLoadMoreVisible && (
        <div className="flex text-center mt-0 justify-center">
          <Button
            onClick={handleLoadMore}
            className="p-2 mt-4 rounded-xl bg-blue-500 text-white"
          >
            Load More&nbsp;&nbsp;
            <HiOutlineArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}
      
    </div>
    </div>
  );
}