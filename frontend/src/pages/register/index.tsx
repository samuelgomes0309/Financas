import {
	BadgeDollarSign,
	HandCoins,
	Landmark,
	NotebookPen,
} from "lucide-react";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import InputReg from "./components/inputReg";
import LabelReg from "./components/labelReg";
import SubmitBtn from "../../components/submitBtn";
import CardTypeReg from "./components/cardTypeReg";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	formInputSchema,
	formRegisterSchema,
	type RegisterFormInput,
	type RegisterFormOutput,
} from "./schema";
import { useState } from "react";
import ErrorMsg from "../../components/errorMsg";
import { api } from "../../api/api";
import z from "zod";
import toast from "react-hot-toast";

export default function Register() {
	const [fieldFocus, setFieldFocus] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormInput>({
		resolver: zodResolver(formInputSchema),
		defaultValues: {
			type: "expense",
			description: "",
			value: "",
		},
	});
	const selectedType = useWatch({ control, name: "type" });
	function fieldFocused(field: string | null) {
		setFieldFocus(field);
	}
	async function submit(data: RegisterFormInput) {
		try {
			//Convertendo o input para o outPut
			const finalData: RegisterFormOutput =
				await formRegisterSchema.parseAsync(data);
			const { description, type, value } = finalData;
			const date = new Date().toLocaleDateString("pt-br");
			await api.post("/transactions/create", {
				date,
				description,
				type,
				value,
			});
			toast.success("Registro criado com sucesso!");
			reset();
		} catch (error: any) {
			if (error instanceof z.ZodError) {
				console.log(error.message);
				return;
			}
		}
	}
	return (
		<div className="bg-background-light flex min-h-screen min-w-full flex-col md:flex-row">
			<Sidebar />
			<main className="flex w-full flex-col">
				<Header title="Registrar" />
				<section className="p-4">
					<form
						onSubmit={handleSubmit(submit)}
						className="flex w-full flex-col items-center gap-2.5 rounded-xl border border-gray-400 p-5 pb-18 shadow-2xl"
					>
						<div className="mb-5 flex w-full max-w-4/5 justify-center gap-3">
							<CardTypeReg
								icon={HandCoins}
								iconColor="#0aff1b"
								value="expense"
								isSelected={selectedType}
								name="type"
								register={register}
							/>
							<CardTypeReg
								icon={Landmark}
								iconColor="#f3ff0a"
								value="revenue"
								name="type"
								isSelected={selectedType}
								register={register}
								error={errors.type?.message}
							/>
						</div>
						<ErrorMsg>{errors.type?.message}</ErrorMsg>
						<div className="flex w-full max-w-4/5 flex-col rounded-xl bg-white px-5 py-8 shadow-2xl shadow-gray-400">
							<div>
								<h1 className="text-center text-xl font-medium italic">
									Informações da transação
								</h1>
							</div>
							<LabelReg message="Valor" />
							<InputReg
								icon={BadgeDollarSign}
								type="string"
								error={errors.value?.message}
								name="value"
								placeholder="Ex: 199.70"
								register={register}
								fieldFocus={fieldFocus}
								onBlur={() => fieldFocused(null)}
								onFocus={() => fieldFocused("value")}
							/>
							<ErrorMsg>{errors.value?.message}</ErrorMsg>
							<LabelReg message="Descrição" />
							<InputReg
								icon={NotebookPen}
								type="text"
								error={errors.description?.message}
								placeholder="Digite aqui a descrição da transação"
								fieldFocus={fieldFocus}
								name="description"
								register={register}
								onBlur={() => fieldFocused(null)}
								onFocus={() => fieldFocused("description")}
							/>
							<ErrorMsg>{errors.description?.message}</ErrorMsg>
							<SubmitBtn label="Cadastrar" disabled={isSubmitting} />
						</div>
					</form>
				</section>
			</main>
		</div>
	);
}
