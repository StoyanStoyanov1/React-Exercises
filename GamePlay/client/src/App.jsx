import {Routes, Route} from 'react-router-dom'

import Header from "./components/header/Header.jsx";
import Home from "./components/home/Home.jsx";
import GameList from "./components/gameList/GameList.jsx";
import GameCreate from "./components/gameCreate/gameCreate.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/register/Register.jsx";
import GameDetails from "./components/gameDetails/GameDetails.jsx";


function Logout() {
    return null;
}

function App() {

  return (
      <div id="box">
          <Header/>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/games' element={<GameList />} />
            <Route path='/games/create' element={<GameCreate />}/>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/games/:gameId' element={<GameDetails />} />
        </Routes>

      </div>
  )
}

export default App
