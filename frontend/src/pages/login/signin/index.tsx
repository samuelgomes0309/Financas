import { LockKeyhole, Eye, EyeOff, Mail } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SignInData } from "../schema";
import type { LoginComponentProps } from "..";
import ErrorMsg from "../../../components/errorMsg";
import FooterMsg from "../components/footerMsg";
import HeaderMsg from "../components/headerMsg";
import InputForm from "../components/inputForm";
import LabelMsg from "../components/labelMsg";
import { AuthContext } from "../../../contexts/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SubmitBtn from "../../../components/submitBtn";

export default function SignIn({ isLogin, setIsLogin }: LoginComponentProps) {
	const { handleLogin } = useContext(AuthContext)!;
	const nav = useNavigate();
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [fieldFocus, setFieldFocus] = useState<string | null>(null);
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInData>({
		resolver: zodResolver(signinSchema),
	});
	async function submit(data: SignInData) {
		if (!data) {
			toast.error("Verifique se todos os campos estao preenchidos!");
			return;
		}
		const response = await handleLogin(data);
		if (!response) {
			return;
		}
		toast.success("Login, realizado com sucesso!");
		nav("/");
	}
	function fieldFocused(field: string | null) {
		setFieldFocus(field);
	}
	useEffect(() => {
		reset({});
	}, [isLogin]);
	return (
		<div className="bg-background-light flex min-h-screen min-w-full p-5">
			<main className="mx-auto my-auto flex w-11/12 max-w-xl flex-col items-center rounded-2xl bg-white px-5 py-12 shadow-2xl shadow-gray-700">
				<HeaderMsg subtitle="Acesse sua conta para controlar suas finanças" />
				<form className="flex w-full flex-col" onSubmit={handleSubmit(submit)}>
					<LabelMsg message="Email" />
					<InputForm<SignInData>
						fieldFocus={fieldFocus}
						icon={Mail}
						name="email"
						type="email"
						placeholder="email@email.com"
						onFocus={() => fieldFocused("email")}
						onBlur={() => fieldFocused(null)}
						register={register}
						error={errors.email?.message}
					/>
					<ErrorMsg>{errors.email?.message}</ErrorMsg>
					<LabelMsg message="Senha" />
					<InputForm<SignInData>
						type={passwordVisible ? "text" : "password"}
						placeholder="******"
						fieldFocus={fieldFocus}
						icon={LockKeyhole}
						name="password"
						onFocus={() => fieldFocused("password")}
						onBlur={() => fieldFocused(null)}
						register={register}
						error={errors.password?.message}
					>
						<button
							type="button"
							className="cursor-pointer transition duration-1000 hover:text-black"
							onClick={() => setPasswordVisible(!passwordVisible)}
						>
							{passwordVisible ? <EyeOff /> : <Eye />}
						</button>
					</InputForm>
					<ErrorMsg>{errors.password?.message}</ErrorMsg>
					<SubmitBtn label="Entrar" disabled={isSubmitting} />
				</form>
				<FooterMsg
					label="Não possui uma conta?"
					linkText="Cadastre-se"
					onFocus={() => fieldFocused(null)}
					onClick={() => setIsLogin(false)}
					disabled={isSubmitting}
				/>
			</main>
		</div>
	);
}
