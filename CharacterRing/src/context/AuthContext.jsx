import {createContext} from "react";
import {useNavigate} from "react-router-dom";
import * as authServer from '../../../GamePlay/client/src/services/authService.js';
import Path from '../paths.js';

const AuthContext = createContext();

export const AuthProvider = ({children,}) => {

	const navigate = useNavigate();

	const registerSubmitHandler = async (values) => {
		const result = await authServer.register('POST', values.email, values.password);

		localStorage.setItem('accessToken', result.accessToken);

		navigate(Path.Home)
	}

	const loginSubmitHandler = async (values) => {
		const result = await authServer.login('POST', values.email, values.password);

		localStorage.setItem('accessToken', result.accessToken);

		navigate(Path.Home)
	}

	const logoutHandler = async () => {
		localStorage.removeItem('accessToken');

		navigate(Path.Home);
	}

	const auth = JSON.parse(localStorage.getItem('accessToken')) || {};

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