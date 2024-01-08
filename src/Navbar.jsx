
'use client';

import { Navbar, Modal, Button } from 'flowbite-react';
import { DarkThemeToggle } from 'flowbite-react';
import { useState } from 'react';

export default function Ournavbar() {
  const [openAboutModal, setOpenAboutModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);

  return (
    <Navbar fluid rounded>
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
          <Navbar.Link
            onClick={() => setOpenAboutModal(true)}
            className='cursor-pointer'
          >
            About
          </Navbar.Link>
          <Navbar.Link
            onClick={() => setOpenContactModal(true)}
            className='cursor-pointer'
          >
            Contact
          </Navbar.Link>
        </Navbar.Collapse>

        <DarkThemeToggle className='ml-6'/>
      </div>

      {/* About Modal */}
      <Modal dismissible show={openAboutModal} onClose={() => setOpenAboutModal(false)}>
      <Modal.Header><h2 className="mb-0 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">About</h2></Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla, saepe? Odit tempora nostrum minus id aperiam non enim pariatur, recusandae dolores? Odit sed quos, libero rerum magnam quisquam amet a!
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla, saepe? Odit tempora nostrum minus id aperiam non enim pariatur, recusandae dolores? Odit sed quos, libero rerum magnam quisquam amet a!
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      {/* Contact Modal */}
      <Modal dismissible show={openContactModal} onClose={() => setOpenContactModal(false)}>
        <Modal.Header><h2 className="mb-0 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2></Modal.Header>
        <Modal.Body>
<section className="bg-white dark:bg-gray-900">
  <div className="py-8 px-4 mx-auto max-w-screen-md">
      
      <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback? Need details about our web & app development plan? Let us know.</p>
      <form action="#" className="space-y-8">
          <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
              <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@yourdomain.com" required/>
          </div>
          <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
              <input type="text" id="subject" className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required/>
          </div>
          <div className="sm:col-span-2">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
              <textarea id="message" rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
          </div>
          <Button type="submit" >Send message</Button>
      </form>
  </div>
</section>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

    </Navbar>
  );
}
