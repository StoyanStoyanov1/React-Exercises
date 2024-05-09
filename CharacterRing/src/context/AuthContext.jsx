import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as authServer from '../services/authService.js';
import Path from '../paths.js';

const AuthContext = createContext();

export const AuthProvider = ({children,}) => {
	const [auth, setAuth] = useState({});

	const navigate = useNavigate();

	const registerSubmitHandler = async (values) => {
		const result = await authServer.register(values.email, values.password);

		setAuth(result);
		localStorage.setItem('accessToken', result.accessToken);

		navigate(Path.Home)
	}

	const loginSubmitHandler = async (values) => {
		const result = await authServer.login(values.email, values.password);

		setAuth(result);
		localStorage.setItem('accessToken', result.accessToken);

		navigate(Path.Home)
	}

	const logoutHandler = async () => {
		localStorage.removeItem('accessToken');
		setAuth({});

		navigate(Path.Home);
	}

	const values = {
		loginSubmitHandler,
		registerSubmitHandler,
		logoutHandler,
		email: auth.email,
		id: auth._id,
		isAuthenticated: !!auth.accessToken,
	}

	return (
		<AuthContext.Provider value={values}>
			{children}
		</AuthContext.Provider>
	)

};

AuthContext.displayName = 'authContext';

export default AuthContext;