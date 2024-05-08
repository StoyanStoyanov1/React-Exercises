import {Link} from "react-router-dom";
import Path from "../../paths.js";

export default function Register() {
	return (
		<section id="register">

			<div className="form">
				<img className="border" src="./images/border.png" alt=""/>
				<h2>Register</h2>
				<form className="register-form">
					<input
						type="text"
						name="email"
						id="register-email"
						placeholder="email"
					/>
					<input
						type="password"
						name="password"
						id="register-password"
						placeholder="password"
					/>
					<input
						type="password"
						name="re-password"
						id="repeat-password"
						placeholder="repeat password"
					/>
					<button type="submit">register</button>
					<p className="message">Already registered? <Link to={Path.Login}>Login</Link></p>
				</form>
				<img className="border" src="./images/border.png" alt=""/>
			</div>

		</section>
	)
}