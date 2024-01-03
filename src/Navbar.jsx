
'use client';

import { Navbar } from 'flowbite-react';
import { DarkThemeToggle } from 'flowbite-react';

export default function Ournavbar() {
  return (
    <Navbar fluid rounded >

      {/* Left-justified content */}
      <div className="flex items-center w-auto justify-between">
        <Navbar.Brand href="https://erniejohnson.ca">
          <img src="https://erniejohnson.ca/favicon.svg" className="mr-3 h-6 sm:h-9" alt="ErnieJohnson.ca Logo" />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Log Analysis</span>
        </Navbar.Brand>
      </div>

      {/* Right-justified content */}
      <div className="flex items-center">
      <Navbar.Toggle />

        <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">
            About
          </Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse>

        <DarkThemeToggle className='ml-6'/>
      </div>

    </Navbar>
  );
}
