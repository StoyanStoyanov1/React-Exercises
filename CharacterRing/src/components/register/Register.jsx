import {Link} from "react-router-dom";
import Path from "../../paths.js";
import AuthContext from "../../context/AuthContext.jsx"
import {useContext} from "react";
import useForm from "../../hooks/useForm.js";


const registerFormKeys = {
	Email: 'email',
	Password: 'password',
	RepeatPassword: 're-password',
}
export default function Register() {
	const {registerSubmitHandler} = useContext(AuthContext)
	const {values, onChange, onSubmit} = useForm(registerSubmitHandler, {
		[registerFormKeys.Email]: '',
		[registerFormKeys.Password]: '',
		[registerFormKeys.RepeatPassword]: '',
	})
	return (
		<section id="register">

			<div className="form">
				<img className="border" src="./images/border.png" alt=""/>
				<h2>Register</h2>
				<form className="register-form" onSubmit={onSubmit}>
					<input
						type="text"
						name="email"
						id="register-email"
						placeholder="email"
						value={values[registerFormKeys.Email]}
						onChange={onChange}
					/>
					<input
						type="password"
						name="password"
						id="register-password"
						placeholder="password"
						value={values[registerFormKeys.Password]}
						onChange={onChange}
					/>
					<input
						type="password"
						name="re-password"
						id="repeat-password"
						placeholder="repeat password"
						value={values[registerFormKeys.RepeatPassword]}
						onChange={onChange}
					/>
					<button type="submit">register</button>
					<p className="message">Already registered? <Link to={Path.Login}>Login</Link></p>
				</form>
				<img className="border" src="./images/border.png" alt=""/>
			</div>

		</section>
	)
}