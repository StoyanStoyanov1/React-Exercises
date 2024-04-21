import {useContext, useEffect} from "react";

import * as authService from '../../services/authService.js'
import {useNavigate} from "react-router-dom";
import Path  from "../../paths.js";
import AuthContext from "../../context/authContext.js";

export default function logout() {
	const navigate = useNavigate();
	const {logoutHandler} = useContext(AuthContext)
	useEffect(() => {
		authService.logout()
			.then(() => {
				logoutHandler();
				navigate(Path.Home);
			})
			.catch(() => navigate(Path.Home));
	}, []);

	return null
}