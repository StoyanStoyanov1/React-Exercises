import {Link} from "react-router-dom";
import Path from "../../paths.js";
import useForm from "../../hooks/useForm.js";
import {useContext} from "react";
import authContext from "../../context/AuthContext.jsx";

const loginFormKeys = {
	Email: 'email',
	Password: 'password',
}
export default function Login() {

	const {loginSubmitHandler} = useContext(authContext);
	const {values, onChange, onSubmit} = useForm(loginSubmitHandler, {
		[loginFormKeys.Email]: '',
		[loginFormKeys.Password]: '',
	})

	return (
		<section id="login">
			<div className="form">
				<img className="border" src="./images/border.png" alt="" />
					<h2>Login</h2>
					<form className="login-form" onSubmit={onSubmit}>
						<input
							type="text"
							name="email"
							id="email"
							placeholder="email"
							value={values[loginFormKeys.Email]}
							onChange={onChange}
						/>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="password"
							value={values[loginFormKeys.Password]}
							onChange={onChange}
						/>
						<button type="submit">login</button>
						<p className="message">
							Not registered? <Link to={Path.Register}>Create an account</Link>
						</p>
					</form>
					<img className="border" src="./images/border.png" alt="" />
			</div>
		</section>
	)
}