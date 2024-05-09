import {useContext, useEffect} from "react";
import AuthContext from "../../context/AuthContext.jsx";
import * as AuthServer from '../../servers/authServer.js'
import {useNavigate} from "react-router-dom";
import Path from "../../paths.js";

export default function Logout() {
	const navigate = useNavigate();
	const {logoutHandler} = useContext(AuthContext);

	useEffect(() => {
		AuthServer.logout()
			.then(() => {
					logoutHandler();
					navigate(Path.Logout);
				}
			).catch(() => {
			logoutHandler();
			navigate(Path.Logout)
		})
	}, []);

}