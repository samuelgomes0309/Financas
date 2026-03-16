import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateTransactionController } from "./controllers/transaction/CreateTransactionController";
import { ListTransactionController } from "./controllers/transaction/ListTransactionController";
import { DeleteTransactionController } from "./controllers/transaction/DeleteTransactionController";
import { ListBalanceController } from "./controllers/user/ListBalanceController";

const router = Router();

// Rotas de usuarios
router.post("/users/signup", new CreateUserController().handle);
router.post("/users/session", new AuthUserController().handle);
router.get("/users/me", isAuthenticated, new DetailUserController().handle);
router.get(
	"/users/balance",
	isAuthenticated,
	new ListBalanceController().handle
);

//Rotas das transações
router.post(
	"/transactions/create",
	isAuthenticated,
	new CreateTransactionController().handle
);
router.get(
	"/transactions",
	isAuthenticated,
	new ListTransactionController().handle
);
router.delete(
	"/transactions/delete",
	isAuthenticated,
	new DeleteTransactionController().handle
);

export { router };
