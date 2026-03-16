import prismaClient from "../../prisma";

interface ListRequest {
	user_id: string;
	date: string;
}

class ListTransactionService {
	async execute({ date, user_id }: ListRequest) {
		if (!user_id) {
			throw new Error("Not authorized");
		}
		if (!date) {
			throw new Error("Date is required");
		}
		const findUser = await prismaClient.user.findFirst({
			where: {
				id: user_id,
			},
		});
		if (!findUser) {
			throw new Error("User not found");
		}
		//Verificar se há como otimizar a consulta do findUser com essa das transações!
		const transactions = await prismaClient.transactions.findMany({
			where: {
				user_id,
				date: date,
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				type: true,
				date: true,
				user_id: true,
				value: true,
				description: true,
			},
		});
		return transactions;
	}
}

export { ListTransactionService };
