import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const prismaClient = new PrismaClient();

export default prismaClient;
