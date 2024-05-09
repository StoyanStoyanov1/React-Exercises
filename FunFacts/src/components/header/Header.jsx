import {Link} from "react-router-dom";
import Path from "../../paths.js";
import Login from "../login/Login.jsx";

export default function Header() {
	return (
		<header>
			<Link id="logo" to={Path.Home}
			><img id="logo-img" src="./images/logo.png" alt=""
			/></Link>

			<nav>
				<div>
					<Link to={Path.FunFacts}>Fun Facts</Link>
				</div>

				<div className="user">
					<Link to={Path.CreateFunFact}>Add Fact</Link>
					<a href="#">Logout</a>
				</div>

				<div className="guest">
					<Link to={Path.Login}>Login</Link>
					<Link to={Path.Register}>Register</Link>

				</div>
			</nav>
		</header>

	)
}