import z from "zod";

export const signUpSchema = z.object({
	name: z.string().nonempty("Nome obrigatório"),
	email: z.email("E-mail inválido"),
	password: z
		.string()
		.nonempty("Senha é obrigatória.")
		.min(6, "Senha deve conter pelo menos 6 caracteres."),
});

export const signinSchema = z.object({
	email: z.email("E-mail inválido"),
	password: z
		.string()
		.nonempty("Senha é obrigatória.")
		.min(6, "Senha deve conter pelo menos 6 caracteres."),
});

export type SignInData = z.infer<typeof signinSchema>;

export type SignUpData = z.infer<typeof signUpSchema>;
