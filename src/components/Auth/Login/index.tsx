import React, { useState } from "react";
import s from "./index.module.scss";
import { login } from "../../../api/auth";

interface LoginProps {
	passwordVisible: boolean;
	handleTogglePasswordVisibility: () => void;
	onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({
	passwordVisible,
	handleTogglePasswordVisibility,
	onLoginSuccess
}) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await login({ username, password });

			onLoginSuccess();
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	return (
		<div className={s.login}>
			<p>Enter your username and password to login.</p>
			<form className={s.form} onSubmit={handleLogin}>
				<input
					type="text"
					name="username"
					placeholder="Enter your login"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<div className={s.passwordContainer}>
					<input
						type={passwordVisible ? "text" : "password"}
						name="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<img
						src={passwordVisible ? "/img/header/eyeClose.svg" : "/img/header/eye.svg"}
						width={24}
						alt="eye"
						onClick={handleTogglePasswordVisibility}
					/>
				</div>
				<a href="///" className={s.forgot}>
					Forgot Password?
				</a>
				<button className={s.loginBtn} type="submit">
					Login
				</button>
			</form>
			<p className={s.loginOption}>Or login with</p>
			<div className={s.anotherMethods}>
				<button>
					<img src="/img/header/google.svg" alt="google" />
					<p>Login with Google</p>
				</button>
				<button>
					<img src="/img/header/facebook.svg" alt="facebook" />
					<p>Login with Facebook</p>
				</button>
			</div>
		</div>
	);
};

export default Login;
