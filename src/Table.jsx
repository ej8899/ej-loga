
'use client';
import React, { useState, useEffect } from 'react';

import { Spinner } from 'flowbite-react';
import { Table } from 'flowbite-react';

// grab ALL data URL: https://erniejohnson.ca/cgi-bin/log.py?action=fetch&fetch=all

export default function Ourdata() {
  const [jsonData, setJsonData] = useState(null);

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
        setJsonData(data);
        console.log("SAMPLE:",data[0])
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

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

  return (
    <div className="overflow-x-auto">
      {jsonData ? (
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Log Message</Table.HeadCell>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>Environment</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {jsonData.slice().reverse().map((row, rowIndex) => (
              <Table.Row
                key={rowIndex}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {row.date}
                </Table.Cell>
                <Table.Cell>{row.log}</Table.Cell>
                <Table.Cell>{truncateUserId(row.userId)}</Table.Cell>
                <Table.Cell>{renderCellValue(row.environment)}</Table.Cell>
                <Table.Cell>
                  <a
                    href="#"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="text-center">
          <Spinner aria-label="Loading log data..." size="xl" />
          <br />
          Loading Data...
        </div>
      )}
    </div>
  );
}
