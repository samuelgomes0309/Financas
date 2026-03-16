import prismaClient from "../../prisma";

interface BalanceRequest {
	user_id: string;
	date: string;
}

interface Balance {
	balance: number;
	revenue: {
		total: number;
		items: ItemBalanceProps[];
	};
	expense: {
		total: number;
		items: ItemBalanceProps[];
	};
}

interface ItemBalanceProps {
	date: string;
	id: string;
	type: string;
	value: number;
	user_id: string;
	description: string;
}

class ListBalanceService {
	async execute({ date, user_id }: BalanceRequest) {
		if (!user_id) {
			throw new Error("Not authorized");
		}
		if (!date) {
			throw new Error("Date is required");
		}
		const user = await prismaClient.user.findFirst({
			where: {
				id: user_id,
			},
		});
		// Despesa =   expense;
		const expense = await prismaClient.transactions.findMany({
			where: {
				user_id: user_id,
				date: date,
				type: "expense",
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				date: true,
				id: true,
				description: true,
				type: true,
				user_id: true,
				value: true,
			},
		});
		// Receita =   revenue;
		const revenue = await prismaClient.transactions.findMany({
			where: {
				user_id: user_id,
				date: date,
				type: "revenue",
			},
			orderBy: {
				createdAt: "desc",
			},
			select: {
				date: true,
				id: true,
				description: true,
				type: true,
				user_id: true,
				value: true,
			},
		});
		let revenueTotal = 0;
		revenue.map((item) => {
			revenueTotal += item.value;
		});
		let expenseTotal = 0;
		expense.map((item) => {
			expenseTotal += item.value;
		});
		const itemBalance: Balance = {
			balance: user.balance,
			revenue: {
				total: revenueTotal,
				items: revenue,
			},
			expense: {
				total: expenseTotal,
				items: expense,
			},
		};
		return itemBalance;
	}
}

export { ListBalanceService };
