import { Link } from 'react-router-dom';
import {useContext} from "react";
import AuthContext from "../../context/authContext.js";
import authContext from "../../context/authContext.js";

export default function Header () {
	const {
		isAuthenticated,
		username,
	} = useContext(authContext)

	return (
		<header>
			<h1><Link className="home" to="/">GamesPlay</Link></h1>
			<nav>
				<Link to="/games">All games</Link>
				{isAuthenticated && (<div id="user">
					<Link to="/games/create">Create Game</Link>
					<Link to="/logout">Logout</Link>
					<span>| {username}</span>
				</div>)}

				{!isAuthenticated && (<div id="guest">
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
				</div>)}

			</nav>
		</header>
	)
}