import {Link} from "react-router-dom";
import Path from "../../paths.js";
import {useContext} from "react";
import authContext from "../../context/AuthContext.jsx";

export default function Header() {
	const {email, isAuthenticated} = useContext(authContext);

	return (
		<header>
			<Link id="logo" to={Path.Home}
			><img id="logo-img" src="./images/logo.png" alt=""
			/></Link>

			<nav>
				<div>
					<Link to={Path.FunFacts}>Fun Facts</Link>
				</div>

				{isAuthenticated && <div className="user">
					<Link to={Path.CreateFunFact}>Add Fact</Link>
					<Link to={Path.Logout}>Logout</Link>
					<span>| {email}</span>
				</div> || <div className="guest">
					<Link to={Path.Login}>Login</Link>
					<Link to={Path.Register}>Register</Link></div>}

			</nav>
		</header>

	)
}