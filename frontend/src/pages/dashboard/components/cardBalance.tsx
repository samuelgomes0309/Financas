import type { LucideIcon } from "lucide-react";
import type { BalanceData } from "..";

interface CardBalanceProps {
	icon: LucideIcon;
	balance: BalanceData | null;
	type: "expense" | "revenue" | "balance"; //Despesa =expense //Receita = revenue //Saldo = balance
	label: string;
}

export default function CardBalance({
	icon: Icon,
	label,
	balance,
	type,
}: CardBalanceProps) {
	let value = "";
	let style = {
		geral: "",
		icon: "",
	};
	if (balance) {
		switch (type) {
			case "balance":
				value =
					balance?.balance < 0
						? `- R$ ${Math.abs(balance?.balance).toFixed(2)} `
						: `R$ ${balance?.balance.toFixed(2)}`;
				style.geral = "bg-blue-200";
				style.icon = "text-blue-700";
				break;
			case "expense":
				value = `R$ ${balance?.expense.total.toFixed(2)}`;
				style.geral = "bg-red-200";
				style.icon = "text-red-700";
				break;
			case "revenue":
				value = `R$ ${balance?.revenue.total.toFixed(2)}`;
				style.geral = "bg-green-200";
				style.icon = "text-green-700";
				break;
			default:
				value = "R$ 0,00";
				break;
		}
	}
	return (
		<div className="flex min-h-32 w-full flex-col justify-between rounded-xl border border-gray-300 bg-white p-5 shadow-2xl">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">{label}</h1>
				<div
					className={`${style.geral} flex h-10 w-10 items-center justify-center rounded-2xl`}
				>
					<Icon className={style.icon} />
				</div>
			</div>
			<span className="text-shadow-2 mt-14 text-xl font-medium">{value}</span>
		</div>
	);
}
