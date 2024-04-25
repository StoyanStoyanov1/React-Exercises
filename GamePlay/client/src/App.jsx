import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState} from "react";


import * as authService from './services/authService.js';
import AuthContext from "./context/authContext.js";

import Header from "./components/header/Header.jsx";
import Home from "./components/home/Home.jsx";
import GameList from "./components/gameList/GameList.jsx";
import GameCreate from "./components/gameCreate/gameCreate.jsx";
import Login from "./components/login/Login.jsx";
import Register from "./components/register/Register.jsx";
import GameDetails from "./components/gameDetails/GameDetails.jsx";
import Path from "./paths.js";


function Logout() {
	return null;
}

function App() {
	const navigate = useNavigate();

	const [auth, setAuth] = useState({})

	const loginSubmitHandler = async values => {

		const result = await authService.login(values.email, values.password);

		setAuth(result);

		navigate(Path.Home);

	};

	const registerSubmitHandler = async (values) => {
		console.log(values)
		const result = await authService.register(values.email, values.password);
		setAuth(result);

		navigate(Path.Home);
	};

	const values = {
		loginSubmitHandler,
		registerSubmitHandler,
		username: auth.username || auth.email,
		email: auth.email,
		isAuthenticated: !!auth.email,

	};

	return (
		<AuthContext.Provider value={values}>
			<div id="box">
				<Header/>

				<Routes>
					<Route path={Path.Home} element={<Home/>}/>
					<Route path='/games' element={<GameList/>}/>
					<Route path='/games/create' element={<GameCreate/>}/>
					<Route path='/login' element={<Login/>}/>
					<Route path='/register' element={<Register/>}/>
					<Route path='/games/:gameId' element={<GameDetails/>}/>
				</Routes>

			</div>
		</AuthContext.Provider>
	)
}

export default App
