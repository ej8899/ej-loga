
'use client';

import { Navbar, Modal, Button } from 'flowbite-react';
import { DarkThemeToggle } from 'flowbite-react';
import { useEffect, useState } from 'react';
import logger from './logger';

import aboutImage from './assets/smartmarkups.png';

export default function Ournavbar() {
  const [openAboutModal, setOpenAboutModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);

  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSendPending, setIsSendPending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setEmail('');
    setSubject('');
    setMessage('');
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // if (!isFormValidated) {
    //   // setMessageValidation('Please complete all sections of this form!');
    //   return;
    // }
    setIsSendPending(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '7160e73c-4a32-4952-ab02-e07ea131ed58',
          from_name: 'erniejohnson.ca',
          subject: 'erniejohnson.ca - LOGA: ' + subject ,
          message,
          email,
          botcheck: '',
        }),
      });
      const json = (await response.json());

      setIsSendPending(false);
      if (!json.success) throw new Error('Something went wrong.');

      setIsSent(true);
      logger.trace('contact - sent a message success');
    } catch (err) {
      logger.error('error sending contact form');
      setIsSendPending(false);
      setIsError(true);
    }
  }
  

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
            <img src={aboutImage} alt="About Image" className="mx-auto" />
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Our cutting-edge front-end log analysis application empowers our business to gain valuable insights into our single page application performance and user interactions. With a user-friendly interface, the application provides a comprehensive view of visitor details, allowing us to track user behavior, identify patterns, and optimize the user experience. Moreover, the application efficiently logs and reports errors and potential DoS attacks, enabling swift troubleshooting and resolution.<br/><br/>By leveraging advanced analytics and reporting features, our tool equips developers and stakeholders with the tools they need to enhance application security, stability, ensure seamless user experiences, and drive overall success in the dynamic world of web development.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

      {/* Contact Modal */}
      <Modal dismissible 
        show={openContactModal} 
        onClose={
          () => {
            setOpenContactModal(false);
            setIsSent(false);
            setIsError(false);
            setIsSendPending(false);
          }
        }>
        <Modal.Header><h2 className="mb-0 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Contact Us</h2></Modal.Header>
        <Modal.Body>
<section className="bg-white dark:bg-gray-900">
  <div className="py-8 px-4 mx-auto max-w-screen-md">
      {!isSendPending && !isSent && !isError && (
        <>
      <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback? Need details about our web & app development plan? Let us know.</p>
      <form className="space-y-8"
        onSubmit={(e) => void handleFormSubmit(e)}
      >
          <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
              <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)}
                value = {email}
                id="email" 
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@yourdomain.com" required/>
          </div>
          <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
              <input 
                type="text" 
                id="subject"
                value = {subject}
                onChange={(e) => setSubject(e.target.value)}
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required/>
          </div>
          <div className="sm:col-span-2">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
              <textarea 
                id="message" 
                value = {message}
                onChange={(e) => setMessage(e.target.value)}
                rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
          </div>
          <Button type="submit" >Send message</Button>
      </form>
      </>
      )}
      {/* animated hourglass */}
          {isSendPending && (
            <div className='centered_container'>
              <div className='centered_item'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='send-status pending'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='#0284c7'
                    d='M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z'
                    opacity='.5'
                  />
                  <path
                    fill='currentColor'
                    d='M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z'
                    opacity='.75'
                  >
                    <animateTransform
                      attributeName='transform'
                      dur='2s'
                      from='0 12 12'
                      repeatCount='indefinite'
                      to='360 12 12'
                      type='rotate'
                    />
                  </path>
                </svg>
              </div>
            </div>
          )}
          {/* green checkmark icon */}
          {isSent && (
            <>
              <div className='centered_container'>
                <div className='centered_item'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='send-status sent'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='#16a34a'
                      d='m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z'
                    />
                  </svg>
                  <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
                    Thank you for reaching out...
                    <br />I will respond to your message asap!
                  </p>
                </div>
              </div>
            </>
          )}
          {/* error during send */}
          {isError && (
            <>
              <div className='centered_container'>
                <div className='centered_item'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='send-status error'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='#ef4444'
                      d='M12 17q.425 0 .713-.288T13 16q0-.425-.288-.713T12 15q-.425 0-.713.288T11 16q0 .425.288.713T12 17Zm0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8v4q0 .425.288.713T12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z'
                    />
                  </svg>
                  <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
                    Something went wrong. <br />
                    <br />
                    Email me directly at{' '}
                    <a href='mailto:ernie@erniejohnson.ca'>
                      <b>ernie@erniejohnson.ca</b>
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
  </div>
</section>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>

    </Navbar>
  );
}
