import './App.css'
import Ourfooter from './Footer'
import Ournavbar from './Navbar'
import Ourdata from './Table'

function App() {

  return (
    <>

      <div className="m-8">
        <Ournavbar/>
        <div className="h-10"></div>
        <Ourdata/>
        <div className="h-10"></div>
        <Ourfooter/>
      </div>
    </>
  )
}

export default App
