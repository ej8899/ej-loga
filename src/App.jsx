import './App.css'
import Ourfooter from './Footer'
import Ournavbar from './Navbar'
import Summaries from './Summaries';
import Ourdata from './Table'
import { Flowbite } from 'flowbite-react';

function App() {

  return (
    <Flowbite>
      <div className="m-8">
        <Ournavbar/>
        <div className="h-10"></div>
        <Summaries/>
        <div className="h-10"></div>
        <Ourdata/>
        <div className="h-10"></div>
        <Ourfooter/>
      </div>
    </Flowbite>
  )
}

export default App
