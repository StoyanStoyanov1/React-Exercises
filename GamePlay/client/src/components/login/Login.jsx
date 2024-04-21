import userForm from "../../hooks/userForm.js";
import AuthContext from "../../context/authContext.js";
import {useContext} from "react";

const LoginFormKeys = {
	EmaiL: 'email',
	Password: 'password',
};

export default function Login() {

	const {loginSubmitHandler} = useContext(AuthContext)
	const {values, onChange, onSubmit} = userForm(loginSubmitHandler,
		{
			[LoginFormKeys.EmaiL]: '',
			[LoginFormKeys.Password]: '',
		}
	);

	return (
		<section id="login-page" className="auth">
			<form id="login" onSubmit={onSubmit}>

				<div className="container">
					<div className="brand-logo"></div>
					<h1>Login</h1>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email" name="email"
						placeholder="Sokka@gmail.com"
						onChange={onChange}
						value={values[LoginFormKeys.EmaiL]}
					/>

					<label htmlFor="login-pass">Password:</label>
					<input
						type="password"
						id="login-password"
						name="password"
						onChange={onChange}
						value={values[LoginFormKeys.Password]}
					/>
					<input type="submit" className="btn submit" value="Login"/>
					<p className="field">
						<span>If you don't have profile click <a href="#">here</a></span>
					</p>
				</div>
			</form>
		</section>
	);
}
