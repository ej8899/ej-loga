
'use client';
import { useState } from 'react';
import { Button, Footer, Modal } from 'flowbite-react';
import logger from './logger';

export default function Ourfooter() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Footer container>
      <Footer.Copyright href="https://erniejohnson.ca" by="ErnieJohnson.ca" year={2024} />
      <Footer.LinkGroup>
        <Footer.Link onClick={() => {logger.trace('✅ read: privacy policy');setOpenModal(true)}}>Privacy Policy</Footer.Link>
      </Footer.LinkGroup>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Privacy Policy</Modal.Header>
        <Modal.Body>
          <div className="space-y-6  text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {/* <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400"></p> */}
            
    <p><strong>Last updated:</strong> 2024-01-06</p>

    <span className="text-base leading-relaxed   text-base leading-relaxed text-gray-500 dark:text-gray-400 ">Our website/app respects your privacy and is committed to protecting any personal information you may provide. This Privacy Policy outlines how we collect, use, and safeguard your data.</span>

    <h2>Information We Collect:</h2>
    <span className="text-base leading-relaxed text-base leading-relaxed text-gray-500 dark:text-gray-400">We may collect basic user data (e.g., name, email) for communication purposes.</span>

    <h2>How We Use Your Information:</h2>
    <span className="text-base leading-relaxed text-base leading-relaxed text-gray-500 dark:text-gray-400">Your information is used solely for analysis of traffic flow on our website(s).</span>

    <h2>Data Security:</h2>

    <span className="text-base leading-relaxed text-base leading-relaxed text-gray-500 dark:text-gray-400">We prioritize the security of your information and implement measures to prevent unauthorized access. No personally identifiable information is avaiable for access.</span>

    <h2>Third-Party Links:</h2>

    <span className="text-base leading-relaxed text-base leading-relaxed text-gray-500 dark:text-gray-400">Our website/app may contain links to third-party websites. We are not responsible for their privacy practices.</span>

    <h2>Changes to This Policy:</h2>

    <span className="text-base leading-relaxed text-base leading-relaxed text-gray-500 dark:text-gray-400">We reserve the right to update our Privacy Policy. Any changes will be reflected on this page.</span>

    <h2>Contact Us:</h2>
    <span className="text-base leading-relaxed text-base leading-relaxed text-gray-500 dark:text-gray-400">If you have any questions about our Privacy Policy, please contact us at ernie@erniejohnson.ca</span>

          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
        </Modal.Footer>
      </Modal>
    </Footer>
  );
}
