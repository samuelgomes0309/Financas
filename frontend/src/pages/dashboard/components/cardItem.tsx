import { Trash, TrendingDown, TrendingUp } from "lucide-react";
import type { TransactionItemProps } from "..";

interface CardItemProps {
	transaction: TransactionItemProps;
	deleteItem: (item_id: string) => void;
}

export default function CardItem({ transaction, deleteItem }: CardItemProps) {
	const { description, id, type, value } = transaction;
	return (
		<div className="flex items-center gap-2 border-b border-gray-200 px-4 py-5">
			<div
				className={`flex h-10 w-10 items-center justify-center rounded-2xl ${type === "expense" ? "bg-red-200" : "bg-green-200"}`}
			>
				{type === "expense" ? (
					<TrendingDown className={"text-red-700"} />
				) : (
					<TrendingUp className={"text-green-700"} />
				)}
			</div>
			<div className="flex flex-1">
				<p className="line-clamp-3 px-2 select-none">{description}</p>
			</div>
			<div className="flex gap-4">
				<span className="mr-2 font-medium"> R$ {value.toFixed(2)}</span>
				<button
					type="button"
					onClick={() => deleteItem(id)}
					className="hover:text-danger flex cursor-pointer items-center justify-center text-gray-400 transition duration-300 outline-none"
				>
					<Trash />
				</button>
			</div>
		</div>
	);
}
