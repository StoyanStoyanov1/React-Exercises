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
import Logout from './components/logout/Loqout.jsx'


function App() {
	const navigate = useNavigate();
	const [auth, setAuth] = useState(() => {
		localStorage.removeItem('accessToken');
		return {};
	});

	const loginSubmitHandler = async (values) => {
		const result = await authService.login(values.email, values.password);
		setAuth(result);
		localStorage.setItem('accessToken', result.accessToken)

		;		navigate(Path.Home);
	}

	const registerSubmitHandler = async (values) => {
		const result = await authService.register(values.email, values.password)

		setAuth(result);
		localStorage.setItem('accessToken', result.accessToken)
		navigate(Path.Home)

	}

	const logoutHandler = () => {
		setAuth({});
		localStorage.removeItem('accessToken');
	}

	const values = {
		loginSubmitHandler,
		registerSubmitHandler,
		logoutHandler,
		username: auth.username || auth.email,
		email: auth.email,
		isAuthenticated: !!auth.email ,
	}

	return (
		<AuthContext.Provider value={ values }>a
			<div id="box">
				<Header/>

				<Routes>
					<Route path={Path.Home} element={<Home/>}/>
					<Route path="/games" element={<GameList/>}/>
					<Route path="/games/create" element={<GameCreate/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/register" element={<Register/>}/>
					<Route path="/games/:gameId" element={<GameDetails/>}/>
					<Route path={Path.Logout} element={<Logout />}/>
				</Routes>
			</div>

		</AuthContext.Provider>

	)
}

export default App
