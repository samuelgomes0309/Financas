import { Request, Response } from "express";
import { DeleteTransactionService } from "../../services/transaction/DeleteTransactionService";

class DeleteTransactionController {
	async handle(req: Request, res: Response) {
		const item_id = req.query.item_id as string;
		const user_id = req.user_id;
		const deletetransactionService = new DeleteTransactionService();
		const transaction = await deletetransactionService.execute({
			item_id,
			user_id,
		});
		return res.json(transaction);
	}
}

export { DeleteTransactionController };
