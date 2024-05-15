import {useContext} from "react";
import AuthContext from "../../context/AuthContext.jsx";
import {Navigate, useNavigate} from "react-router-dom";
import Path from "../../paths.js";

export default function AuthGuards() {
	const {isAuthenticated} = useContext(AuthContext)

	if (!isAuthenticated) {
		return <Navigate to={Path.Login}/>
	}

	return
}