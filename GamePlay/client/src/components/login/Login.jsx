import useForm from "../../hooks/useForm.js";

export default function Login() {
	const loginForm = {Email: 'email', Password: 'password'};


	const [values, onChange, onSubmit] = useForm({
		[loginForm.Email]: '',
		[loginForm.Password]: '',
	});

	return (
		<section id="login-page" className="auth">
			<form id="login">

				<div className="container">
					<div className="brand-logo"></div>
					<h1>Login</h1>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Sokka@gmail.com"
						value={values[loginForm.Email]}
						onChange={onChange}
						onSubmit={onSubmit}
					/>

					<label htmlFor="login-pass">Password:</label>
					<input
						type="password"
						id="login-password"
						name="password"
						value={values[loginForm.Password]}
						onChange={onChange}
						onSubmit={onSubmit}

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