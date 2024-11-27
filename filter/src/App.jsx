import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import customFilterLogic from './components/filter/customFilterLogic'

const tableData = {
   "ID": [1, 2, 3, 4, 5],
   "Name": ["John", "Sane", "Jack", "Bill", "Hames"],
   "Age": [30, 28, 35, 32, 40],
   "Department": ["Engineering", "HR", "Marketing", "Engineering", "Sales"],
   "Salary": ["5000", "450", "60000", "5500", "7000"],
   "JoiningDate": ["2020-01-10", "2019-06-15", "2021-03-01", "2020-09-30", "2018-11-20"],
   "Active": [true, false, true, true, false]
 };

function App() {
  const [count, setCount] = useState(0);
  const [order, setOrder] = useState('asc');

  const setDate = () => {
      customFilterLogic(tableData, order);
      setOrder(order === 'asc' ? 'desc' : 'asc')
  }
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={setDate}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
