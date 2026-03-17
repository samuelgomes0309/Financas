import { z } from "zod";

export const formInputSchema = z.object({
	value: z
		.string()
		.min(1, "Valor deve ser preenchido e ser um numero positivo.")
		.refine((val) => !val.trim().startsWith("-"), {
			message: "O valor não pode ser negativo",
		})
		.refine((val) => !isNaN(parseFloat(val.replace(",", "."))), {
			message: "Valor inválido. Use ponto ou vírgula como separador decimal.",
		}),
	description: z.string().min(1, "Descrição é obrigatória"),
	type: z.enum(["expense", "revenue"]),
});

//Estava dando um erro de tipagem, foi necessario realizar o Input e o Output
export type RegisterFormInput = z.infer<typeof formInputSchema>;

export const formRegisterSchema = formInputSchema.extend({
	value: formInputSchema.shape.value
		.transform((val) => parseFloat(val.replace(",", ".")))
		.refine((val) => val > 0, { message: "O valor deve ser maior que zero" }),
});

export type RegisterFormOutput = z.infer<typeof formRegisterSchema>;
