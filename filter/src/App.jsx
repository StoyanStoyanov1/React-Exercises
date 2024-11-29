import {Route, Routes} from 'react-router-dom'
import paths from './paths/paths';

import Sorting from './components/filter/Sorting';

const jsonArray = [
  { name: "Alice", age: 25, date: "01.01.2023" },
  { name: "Bob", age: 30, date: "12.10.2020" },
  { name: "Charlie", age: 20, date: "23.05.2021" },
  { name: "David", age: 35, date: "05.03.2024" },
  { name: "Eve", age: 28, date: "19.07.2022" },
  { name: "Frank", age: 22, date: "15.02.2025" },
  { name: "Grace", age: 26, date: "10.06.2020" },
  { name: "Hannah", age: 29, date: "11.04.2023" },
  { name: "Isaac", age: 24, date: "20.08.2021" },
  { name: "Jack", age: 31, date: "02.01.2022" },
  { name: "Karen", age: 27, date: "14.09.2024" },
  { name: "Liam", age: 32, date: "18.11.2020" },
  { name: "Mia", age: 21, date: "25.12.2025" },
  { name: "Noah", age: 23, date: "30.10.2023" },
  { name: "Olivia", age: 33, date: "03.03.2021" },
  { name: "Paul", age: 34, date: "16.06.2022" },
  { name: "Quinn", age: 19, date: "09.05.2024" },
];

function App() {

  
  return (
    <>
    <Routes>
      <Route path={paths.home} element={<Sorting values={jsonArray}/>} />
     </Routes>
    </>
  )
}

export default App
