import {useContext} from "react";
import AuthContext from "../../context/AuthContext.jsx";
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import Path from "../../paths.js";

export default function AuthGuard() {
	const {isAuthenticated} = useContext(AuthContext)

	if (!isAuthenticated) {
		return <Navigate to={Path.Login}/>
	}

	return <Outlet />
}