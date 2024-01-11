import { useEffect } from 'react';
import './App.css'
import Ourfooter from './Footer'
import Ournavbar from './Navbar'
import Summaries from './Summaries';
import Ourdata from './Table'
import { Flowbite } from 'flowbite-react';
import logger from './logger';
import ScrollToTopButton from './ScrollTop';

import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

function App() {
  useEffect(() => {
    // Check if userId already exists in localStorage
    const userId = localStorage.getItem('userId');
    // If not, generate a new userId and save it to localStorage
    if (!userId) {
      const newUserId = generateUUID();
      localStorage.setItem('userId', newUserId);
      logger.info('App started - new user');
    } else {
      logger.info('App started - repeat visitor');
    }
  }, []);

  return (
    <Flowbite
      theme={{
        usePReferences: false,
        theme: {
          darkThemeToggle: {
            base: 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          },
        },
      }}>
        
      <div className="m-8">
        <Ournavbar/>
        
        <div className="h-10"></div>
        
        <Alert className="warning-message mb-6" color="failure" icon={HiInformationCircle}>
          This website is best viewed on larger screens. Please use a larger device for a better experience.
        </Alert>

        <Summaries/>
        <div className="h-10"></div>

 

        <Ourdata/>
        <div className="h-10"></div>
        <Ourfooter/>
      </div>
      <ScrollToTopButton/>
    </Flowbite>
  )
}

export default App
