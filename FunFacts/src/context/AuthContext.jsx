import {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as authService from '../servers/authServer.js'
import Path from "../paths.js";
import usePersistedState from "../hooks/usePersistedState.js";

const AuthContext = createContext();

export const AuthProvider = ({
								 children,
}) => {
	const navigate = useNavigate();

	const [auth, setAuth] = usePersistedState('auth', {});

	const loginSubmitHandler = async (values) => {
		try {
			const result = await authService.login(values.email, values.password);

			setAuth(result);
			localStorage.setItem('accessToken', result.accessToken);

			navigate(Path.Home);
		} catch (err) {
			console.log(`Login error: ${err}`)
		}
	};

	const registerSubmitHandler = async (values) => {
		try {
			const result = await authService.register(values.email, values.password);

			setAuth(result);
			localStorage.setItem('accessToken', result.accessToken);

			navigate(Path.Home);
		} catch (err) {
			console.log(`Register error: ${err}`);
		}
	}


	const logoutHandler = () => {
		try {
			setAuth({});
			localStorage.removeItem('accessToken');

			navigate(Path.Home);
		} catch (err) {
			console.log(err);
		}
	}

	const values = {
		registerSubmitHandler,
		logoutHandler,
		loginSubmitHandler,
		email: auth.email,
		userId: auth._id,
		isAuthenticated: !!auth.accessToken,
	}

	return (
		<AuthContext.Provider value={values}>
			{children}
		</AuthContext.Provider>
	)

}

export default AuthContext