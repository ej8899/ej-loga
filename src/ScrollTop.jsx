import  { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { HiOutlineArrowUp } from 'react-icons/hi';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a scroll event listener to track scroll position
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsVisible(scrolled > 100); // Adjust the threshold as needed
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-4 p-2 rounded-full bg-blue-500 opacity-60 text-white ${
        isVisible ? 'visible' : 'invisible'
      }`}
    >
      <HiOutlineArrowUp 
        className={`h-6 w-6  ${
          isVisible ? 'visible' : 'invisible'
        }`}
      />
    {/* <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
    </svg> */}
    </Button>
  );
}
