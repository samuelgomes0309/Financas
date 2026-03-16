import prismaClient from "../../prisma";

interface DetailRequest {
	user_id: string;
}

class DetailUserService {
	async execute({ user_id }: DetailRequest) {
		if (!user_id) {
			throw new Error("Not authorized");
		}
		const user = await prismaClient.user.findFirst({
			where: {
				id: user_id,
			},
			select: {
				id: true,
				email: true,
				balance: true,
				name: true,
			},
		});
		if (!user) {
			throw new Error("Not authorized");
		}
		return user;
	}
}

export { DetailUserService };
