import prismaClient from "../../prisma";

interface TransactionRequest {
	description: string;
	value: number;
	type: "revenue" | "expense"; // Despesa =  expense; // Receita =  revenue;
	date: string;
	user_id: string;
}

class CreateTransactionService {
	async execute({
		description,
		date,
		type,
		value,
		user_id,
	}: TransactionRequest) {
		if (!user_id) {
			throw new Error("Not authorized");
		}
		if (!type || !value) {
			throw new Error("Type and value are required");
		}
		if (value < 0) {
			throw new Error("Value cannot be negative");
		}
		const findUser = await prismaClient.user.findFirst({
			where: {
				id: user_id,
			},
		});
		if (!findUser) {
			throw new Error("User not found");
		}
		let balance = findUser.balance;
		balance += type === "revenue" ? Number(value) : Number(value) * -1;
		//Criando documento e atualizando o balanço
		const [transaction, updatedUser] = await prismaClient.$transaction([
			prismaClient.transactions.create({
				data: {
					description,
					type,
					value: Number(value),
					date,
					user: { connect: { id: user_id } },
				},
			}),
			prismaClient.user.update({
				where: { id: user_id },
				data: { balance },
			}),
		]);
		return transaction;
	}
}

export { CreateTransactionService };
