import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Filecomparator from './assets/Filecomparator'
import Cardlist from './assets/Cardlist'
import { First } from 'react-bootstrap/esm/PageItem';

function App() {

  return (
    <>
      {/* <h1 className="text-2xl font-bold text-center mb-4">File Comparison & Card List Task</h1>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-4">
       <Filecomparator/>
        <Cardlist/>
      </div> */}
      <First/>
    </>
  )
}

export default App
