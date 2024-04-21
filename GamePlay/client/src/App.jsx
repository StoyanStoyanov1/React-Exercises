import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState} from "react";

import AuthContext from "./context/authContext.js";
import * as authService from './services/authService.js'

import Header from "./components/header/Header"
import Home from "./components/home/Home"
import GameList from './components/game-list/GameList';
import GameCreate from './components/game-create/GameCreate';
import Login from './components/login/Login';
import Register from './components/register/Register';
import GameDetails from './components/game-details/GameDetails';
import Path from "./paths.js";


function App() {
	const navigate = useNavigate();
	const [auth, setAuth] = useState({});

	const loginSubmitHandler = async (values) => {
		const result = await authService.login(values.email, values.password);
		setAuth(result);
		navigate(Path.Home);
	}

	const values = {
		loginSubmitHandler,
		username: auth.username,
		email: auth.email,
		isAuthenticated: !!auth.username,
	}

	return (
		<AuthContext.Provider value={ values }>a
			<div id="box">
				<Header/>

				<Routes>
					<Route path="/" element={<Home/>}/>
					<Route path="/games" element={<GameList/>}/>
					<Route path="/games/create" element={<GameCreate/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>
					<Route path="/games/:gameId" element={<GameDetails/>}/>
				</Routes>
			</div>

		</AuthContext.Provider>

	)
}

export default App
