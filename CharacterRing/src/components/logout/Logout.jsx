import {useNavigate} from "react-router-dom";
import AuthContext from '../../context/AuthContext.jsx'
import {useContext, useEffect} from "react";
import * as authService from '../../services/authService.js'
import Path from "../../paths.js";

export default function Logout() {
	const navigate = useNavigate();
	const {logoutHandler} = useContext(AuthContext);

	useEffect(() => {
		authService.logout()
			.then(() => {
				logoutHandler();

				navigate(Path.Home);
			}).catch(() => {
				logoutHandler();

				navigate(Path.Home);
		})
	}, []);
}