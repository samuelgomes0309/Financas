import prismaClient from "../../prisma";
import bcrypt from "bcryptjs";

interface UserRequest {
	name: string;
	email: string;
	password: string;
	balance: number;
}

class CreateUserService {
	async execute({ name, email, password, balance }: UserRequest) {
		if (!email) {
			throw new Error("Email is required");
		}
		const userAlreadyExists = await prismaClient.user.findFirst({
			where: {
				email,
			},
		});
		if (userAlreadyExists) {
			throw new Error("Email already registered");
		}
		const passwordHash = await bcrypt.hash(password, 8);
		const user = await prismaClient.user.create({
			data: {
				name,
				email,
				password: passwordHash,
				balance,
			},
			select: {
				id: true,
				name: true,
				email: true,
				balance: true,
			},
		});
		return user;
	}
}

export { CreateUserService };
