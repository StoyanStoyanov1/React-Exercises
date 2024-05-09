import {useContext} from "react";
import authContext from "../../context/AuthContext.jsx";
import useForm from "../../hooks/useForm.js";
import {Link} from "react-router-dom";
import Path from "../../paths.js";

const RegisterFormKeys = {
	Email: 'email',
	Password: 'password',
	RePassword: 're-password',
};

export default function Register() {
	const {registerSubmitHandler} = useContext(authContext);
	const {values, onChange, onSubmit} = useForm(registerSubmitHandler, {
		[RegisterFormKeys.Email]: '',
		[RegisterFormKeys.Password]: '',
		[RegisterFormKeys.RePassword]: '',
	})

	return (
		<section id="register">
			<div className="form">
				<h2>Register</h2>
				<form className="register-form" onSubmit={onSubmit}>
					<input
						type="text"
						name="email"
						id="register-email"
						placeholder="email"
						value={values[RegisterFormKeys.Email]}
						onChange={onChange}
					/>
					<input
						type="password"
						name="password"
						id="register-password"
						placeholder="password"
						value={values[RegisterFormKeys.Password]}
						onChange={onChange}
					/>
					<input
						type="password"
						name="re-password"
						id="repeat-password"
						placeholder="repeat password"
						value={values[RegisterFormKeys.RePassword]}
						onChange={onChange}
					/>
					<button type="submit">register</button>
					<p className="message">Already registered? <Link to={Path.Login}>Login</Link></p>
				</form>
			</div>
		</section>
	)
}