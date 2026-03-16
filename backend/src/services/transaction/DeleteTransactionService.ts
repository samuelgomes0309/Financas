import prismaClient from "../../prisma";

interface DeleteRequest {
	item_id: string;
	user_id: string;
}

class DeleteTransactionService {
	async execute({ item_id, user_id }: DeleteRequest) {
		if (!user_id) {
			throw new Error("Not authorized");
		}
		if (!item_id) {
			throw new Error("Item ID is required");
		}
		const user = await prismaClient.user.findFirst({
			where: {
				id: user_id,
			},
			select: {
				balance: true,
			},
		});
		if (!user) {
			throw new Error("User not found");
		}
		const transaction = await prismaClient.transactions.findFirst({
			where: {
				id: item_id,
				user_id: user_id,
			},
		});
		if (!transaction) {
			throw new Error("Transaction not found or does not belong to user");
		}
		const newBalance =
			transaction.type === "expense"
				? user.balance + transaction.value
				: user.balance - transaction.value;
		const [deleteTransaction, updateBalance] = await prismaClient.$transaction([
			prismaClient.transactions.delete({
				where: {
					id: item_id,
				},
			}),
			prismaClient.user.update({
				where: {
					id: user_id,
				},
				data: {
					balance: newBalance,
				},
			}),
		]);
		return {
			message: "Transaction deleted successfully",
			transactionDeleted: deleteTransaction,
		};
	}
}

export { DeleteTransactionService };
