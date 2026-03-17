import { createContext, useEffect, useState, type ReactNode } from "react";
import type { SignInData, SignUpData } from "../pages/login/schema";
import toast from "react-hot-toast";
import { api } from "../api/api";

interface UserPropsRequest {
	id: string;
	name: string;
	email: string;
	balance: number;
	token: string;
}
interface UserProps {
	user_id: string;
	name: string;
	email: string;
	balance: number;
}

interface ContextProps {
	user: UserProps | null;
	handleSignUp: (data: SignUpData) => Promise<boolean>;
	handleLogin: (data: SignInData) => Promise<boolean>;
	signed: boolean;
	logOut: () => Promise<void>;
	loadingAuth: boolean;
}

export const AuthContext = createContext<ContextProps | null>(null);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps | null>(null);
	const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
	useEffect(() => {
		const sub = () => {
			validateUser();
		};
		sub();
	}, []);
	async function validateUser() {
		const token = localStorage.getItem("@financeT") || null;
		if (!token) {
			setUser(null);
			setLoadingAuth(false);
			return;
		}
		try {
			const response = await api.get<UserPropsRequest>("/users/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const { balance, email, name, id } = response.data;
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			setUser({
				balance,
				email,
				name,
				user_id: id,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingAuth(false);
		}
	}
	async function handleSignUp(data: SignUpData) {
		try {
			await api.post("/users/signup", data);
			const login = {
				email: data.email,
				password: data.password,
			};
			const responseLogin = await handleLogin(login);
			if (!responseLogin) {
				return false;
			}
			return true;
		} catch (error: any) {
			toast.error("Erro ao tentar fazer o cadastro", error?.message);
			console.log(error);
			return false;
		}
	}
	async function handleLogin(data: SignInData) {
		try {
			const response = await api.post("/users/session", data);
			const { balance, email, id, name, token } =
				response.data as UserPropsRequest;
			setUser({
				balance: balance,
				email: email,
				name: name,
				user_id: id,
			});
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			handleUserLocalStorage(token);
			return true;
		} catch (error: any) {
			toast.error("Erro ao tentar fazer o login", error?.message);
			return false;
		}
	}
	async function logOut() {
		if (!user) {
			return;
		}
		localStorage.removeItem("@financeT");
		setUser(null);
	}
	function handleUserLocalStorage(token: string) {
		if (!token) {
			return;
		}
		localStorage.setItem("@financeT", token);
	}
	return (
		<AuthContext.Provider
			value={{
				user,
				handleSignUp,
				handleLogin,
				signed: !!user,
				loadingAuth,
				logOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
