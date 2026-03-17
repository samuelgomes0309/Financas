import { LockKeyhole, Eye, EyeOff, Mail, CircleUser } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpData } from "../schema";
import type { LoginComponentProps } from "..";
import FooterMsg from "../components/footerMsg";
import HeaderMsg from "../components/headerMsg";
import LabelMsg from "../components/labelMsg";
import InputForm from "../components/inputForm";
import SubmitBtn from "../../../components/submitBtn";
import { AuthContext } from "../../../contexts/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ErrorMsg from "../../../components/errorMsg";

export default function SignUp({ isLogin, setIsLogin }: LoginComponentProps) {
	const { handleSignUp } = useContext(AuthContext)!;
	const nav = useNavigate();
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [fieldFocus, setFieldFocus] = useState<string | null>(null);
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignUpData>({
		resolver: zodResolver(signUpSchema),
	});
	useEffect(() => {
		reset({});
	}, [isLogin]);
	async function submit(data: SignUpData) {
		if (!data) {
			toast.error("Verifique se todos os campos estao preenchidos!");
			return;
		}
		const response = await handleSignUp(data);
		if (!response) {
			return;
		}
		toast.success("Cadastro/Login, realizado com sucesso!");
		nav("/");
	}
	function fieldFocused(field: string | null) {
		setFieldFocus(field);
	}
	return (
		<div className="bg-background-light flex min-h-screen min-w-full p-5">
			<main className="mx-auto my-auto flex w-11/12 max-w-xl flex-col items-center rounded-2xl bg-white px-5 py-12 shadow-2xl shadow-gray-700">
				<HeaderMsg subtitle="Crie sua conta para controlar suas finanças" />
				<form className="flex w-full flex-col" onSubmit={handleSubmit(submit)}>
					<LabelMsg message="Nome" />
					<InputForm<SignUpData>
						type={"text"}
						placeholder="Digite seu nome"
						fieldFocus={fieldFocus}
						icon={CircleUser}
						name="name"
						onFocus={() => fieldFocused("name")}
						onBlur={() => fieldFocused(null)}
						register={register}
						error={errors.name?.message}
					/>
					<ErrorMsg>{errors.name?.message}</ErrorMsg>
					<LabelMsg message="Email" />
					<InputForm<SignUpData>
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
					<InputForm<SignUpData>
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
					<SubmitBtn label="Cadastrar" disabled={isSubmitting} />
				</form>
				<FooterMsg
					label="Já possui uma conta?"
					linkText="Faça o login!"
					disabled={isSubmitting}
					onFocus={() => fieldFocused(null)}
					onClick={() => setIsLogin(true)}
				/>
			</main>
		</div>
	);
}
