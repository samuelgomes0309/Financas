import { Request, Response } from "express";
import { ListTransactionService } from "../../services/transaction/ListTransactionService";

class ListTransactionController {
	async handle(req: Request, res: Response) {
		const date = req.query.date as string;
		const user_id = req.user_id;
		const listTransactionService = new ListTransactionService();
		const transactions = await listTransactionService.execute({
			date,
			user_id,
		});
		return res.json(transactions);
	}
}

export { ListTransactionController };
