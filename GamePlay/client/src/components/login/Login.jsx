import useForm from "../../hooks/useForm.js";
import {useContext} from "react";
import AuthContext from "../../context/authContext.jsx";
const loginForm = {
	Email: 'email',
	Password: 'password',
};

export default function Login() {

	const {loginSubmitHandler} = useContext(AuthContext);

	const {values, onChange, onSubmit} = useForm(loginSubmitHandler, {
		[loginForm.Email]: '',
		[loginForm.Password]: '',
	});

	return (
		<section id="login-page" className="auth">
			<form id="login" onSubmit={onSubmit}>

				<div className="container">
					<div className="brand-logo"></div>
					<h1>Login</h1>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name={loginForm.Email}
						placeholder="Sokka@gmail.com"
						value={values[loginForm.Email]}
						onChange={onChange}
					/>

					<label htmlFor="login-pass">Password:</label>
					<input
						type="password"
						id="login-password"
						name={loginForm.Password}
						value={values[loginForm.Password]}
						onChange={onChange}


					/>
					<input type="submit" className="btn submit" value="Login"/>
					<p className="field">
						<span>If you don't have profile click <a href="#">here</a></span>
					</p>
				</div>
			</form>
		</section>

	)
}