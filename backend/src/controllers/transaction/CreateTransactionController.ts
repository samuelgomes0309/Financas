import { Request, Response } from "express";
import { CreateTransactionService } from "../../services/transaction/CreateTransactionService";

class CreateTransactionController {
	async handle(req: Request, res: Response) {
		const { description, value, type, date } = req.body;
		const user_id = req.user_id;
		const createTransactionService = new CreateTransactionService();
		const transaction = await createTransactionService.execute({
			description,
			date,
			type,
			value,
			user_id,
		});
		return res.json(transaction);
	}
}

export { CreateTransactionController };
