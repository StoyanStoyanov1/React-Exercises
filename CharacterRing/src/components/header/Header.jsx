import {Link} from "react-router-dom";
import Path from '../../paths.js'
import {useContext} from "react";
import AuthContext from "../../context/AuthContext.jsx";
export default function Header() {
	const {
		email,
		isAuthenticated,
	} = useContext(AuthContext);

	return (
		<header>
			<Link id="logo" to={Path.Home}><img id="logo-img" src="./images/logo.png" alt=""/></Link>
			<nav>
				<div>
					<Link to={Path.Characters}>Characters</Link>
				</div>
				{isAuthenticated && (<div className="user">
					<Link to={Path.CreateCharacter}>Add Character</Link>
					<Link to={Path.Logout}>Logout</Link>
				</div>)}

				{!isAuthenticated && (<div className="guest">
					<Link to={Path.Login}>Login</Link>
					<Link to={Path.Register}>Register</Link>
				</div>)}

			</nav>
		</header>
	)
}