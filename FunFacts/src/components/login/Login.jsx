export default function Login() {
	return (
		<section id="login">
			<div className="form">
				<h2>Login</h2>
				<form className="login-form">
					<input type="text" name="email" id="email" placeholder="email" />
					<input
						type="password"
						name="password"
						id="password"
						placeholder="password"
					/>
					<button type="submit">login</button>
					<p className="message">
						Not registered? <a href="#">Create an account</a>
					</p>
				</form>
			</div>
		</section>

	)
}