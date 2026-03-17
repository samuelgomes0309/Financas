import React, { useState } from "react";
import SignIn from "./signin";
import SignUp from "./signup";

export interface LoginComponentProps {
	isLogin: boolean;
	setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login() {
	const [isLogin, setIsLogin] = useState<boolean>(true);
	return isLogin ? (
		<SignIn isLogin={isLogin} setIsLogin={setIsLogin} key={"signIn"} />
	) : (
		<SignUp isLogin={isLogin} setIsLogin={setIsLogin} key={"signUp"} />
	);
}
