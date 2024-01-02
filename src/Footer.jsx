
'use client';

import { Footer } from 'flowbite-react';

export default function Ourfooter() {
  return (
    <Footer container>
      <Footer.Copyright href="#" by="ErnieJohnson.ca" year={2024} />
      <Footer.LinkGroup>
        <Footer.Link href="#">About</Footer.Link>
        <Footer.Link href="#">Privacy Policy</Footer.Link>
        <Footer.Link href="#">Contact</Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
}
