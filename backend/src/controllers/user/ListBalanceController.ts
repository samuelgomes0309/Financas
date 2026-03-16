import { Request, Response } from "express";
import { ListBalanceService } from "../../services/user/ListBalanceService";

class ListBalanceController {
	async handle(req: Request, res: Response) {
		const user_id = req.user_id;
		const date = req.query.date as string;
		const listBalanceService = new ListBalanceService();
		const balance = await listBalanceService.execute({ date, user_id });
		return res.json(balance);
	}
}

export { ListBalanceController };
