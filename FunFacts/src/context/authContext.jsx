import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as authService from '../servers/authServer.js'
import Path from "../paths.js";

const AuthContext = createContext();

const authProvider = ({children}) => {
	const navigate = useNavigate();

	const [auth, setAuth] = useState({});

	const loginSubmitHandler = async (values) => {
		const result = await authService.login(values.email, values.password);

		setAuth(result);
		localStorage.setItem('accessToken', result.accessToken);

		navigate(Path.Home);
	}

	const registerSubmitHandler = async (values) => {
		const result = await authService.register(values.email, values.password);

		setAuth(result);
		localStorage.setItem('accessToken', result.accessToken);

		navigate(Path.Home);
	}


	const logoutSubmitHandler = () => {
		setAuth({});
		localStorage.removeItem('accessToken');
	}

	const values = {
		registerSubmitHandler,
		logoutSubmitHandler,
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