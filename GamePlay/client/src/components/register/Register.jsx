import {useContext} from "react";
import authContext from "../../context/authContext.js";
import useForm from "../../hooks/useForm.js";

const registerFormKeys = {
	Email: 'email',
	Password: 'password',
	ConfirmPassword: 'confirm-password',
}
export default function Register() {
	const {registerSubmitHandler} = useContext(authContext)
	const { values, onChange, onSubmit } = useForm(registerSubmitHandler, {
		[registerFormKeys.Email]: '',
		[registerFormKeys.Password]: '',
		[registerFormKeys.ConfirmPassword]: '',
	})

	return (
		<section id="register-page" className="content auth">
			<form id="register" onSubmit={onSubmit}>
				<div className="container">
					<div className="brand-logo"></div>
					<h1>Register</h1>

					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name={registerFormKeys.Email}
						placeholder="maria@email.com"
						onChange={onChange}
						value={values[registerFormKeys.Email]}
					/>

					<label htmlFor="pass">Password:</label>
					<input
						type="password"
						name={registerFormKeys.Password}
						id="register-password"
						onChange={onChange}
						value={values[registerFormKeys.Password]}
					/>

					<label htmlFor="con-pass">Confirm Password:</label>
					<input
						type="password"
						name={registerFormKeys.ConfirmPassword}
						id="confirm-password"
						onChange={onChange}
						value={values[registerFormKeys.ConfirmPassword]}
					/>

					<input className="btn submit" type="submit" value="Register"/>

					<p className="field">
						<span>If you already have profile click <a href="#">here</a></span>
					</p>
				</div>
			</form>
		</section>

	)
}