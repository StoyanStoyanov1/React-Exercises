import {Routes, Route, useNavigate, RouterProvider} from 'react-router-dom';
import {useState} from "react";


import * as authService from './services/authService.js';
import {AuthProvider} from "./context/authContext.jsx";

import Header from "./components/header/Header.jsx";
import Home from "./components/home/Home.jsx";
import GameList from "./components/gameList/GameList.jsx";
import GameCreate from "./components/gameCreate/GameCreate.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/register/Register.jsx";
import GameDetails from "./components/gameDetails/GameDetails.jsx";
import Logout from './components/logout/Logout.jsx'
import Path from "./paths.js";
import GameEdit from "./components/gameEdit/GameEdit.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import BaseAuthGuard from "./components/guards/BaseAuthGuard.jsx";
import AuthGuard from "./components/guards/AuthGuard.jsx";


function App() {

	return (
		<ErrorBoundary>
			<AuthProvider>
				<div id="box">
					<Header/>

					<Routes>
						<Route path={Path.Home} element={<Home/>}/>
						<Route path='/games' element={<GameList/>}/>
						<Route path='/login' element={<Login/>}/>
						<Route path='/register' element={<Register/>}/>
						<Route path='/games/:gameId' element={<GameDetails/>}/>

						<Route element={AuthGuard}>
							<Route path={Path.Logout} element={<Logout/>}/>
							<Route path={Path.GameEdit} element={<GameEdit/>}/>
							<Route path='/games/create' element={<GameCreate/>}/>
						</Route>
					</Routes>

				</div>
			</AuthProvider>
		</ErrorBoundary>
	)


}

export default App
