import useForm from "../../hooks/useForm.js";
import {useContext} from "react";
import AuthContext from "../../context/AuthContext.jsx";
import {Link} from "react-router-dom";
import Path from "../../paths.js";

const LoginFormKeys = {
	Email: 'email',
	Password: 'password',
}

export default function Login() {

	const {loginSubmitHandler} = useContext(AuthContext);

	const {values, onChange, onSubmit} = useForm(loginSubmitHandler, {
		[LoginFormKeys.Email]: '',
		[LoginFormKeys.Password]: '',
	})

	return (
		<section id="login">
			<div className="form">
				<h2>Login</h2>
				<form className="login-form" onSubmit={onSubmit}>
					<input
						type="text"
						name="email"
						id="email"
						placeholder="email"
						value={values[LoginFormKeys.Email]}
						onChange={onChange}
					/>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="password"
						value={values[LoginFormKeys.Password]}
						onChange={onChange}

					/>
					<button type="submit">login</button>
					<p className="message">
						Not registered? <Link to={Path.Register}>Create an account</Link>
					</p>
				</form>
			</div>
		</section>

	)
}