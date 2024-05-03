import {useContext} from "react";
import AuthContext from "../../context/authContext.jsx";
import {Navigate, Outlet} from "react-router-dom";

export default function AuthGuard(props) {
	const {isAuthenticated} = useContext(AuthContext)

	if (!isAuthenticated) {
		return <Navigate to={'/login'} />
	}
	return <Outlet/>
}