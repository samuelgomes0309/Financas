import type { LucideIcon } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import type { RegisterFormInput } from "../schema";

interface CardTypeRegProps {
	icon: LucideIcon;
	iconColor: string;
	value: "expense" | "revenue";
	register: UseFormRegister<RegisterFormInput>;
	name: "type";
	isSelected: string;
	error?: string;
}

export default function CardTypeReg({
	icon: Icon,
	iconColor,
	register,
	name,
	value,
	isSelected,
	error,
}: CardTypeRegProps) {
	const isActive = isSelected === value;
	const highlightColor =
		value === "revenue" ? "border-success" : "border-secondary";
	const hasError = !!error;
	return (
		<label
			className={`relative flex h-36 w-72 cursor-pointer flex-col items-center justify-center rounded-xl bg-white transition-all duration-200 select-none ${
				isActive
					? `border-2 ${highlightColor} shadow-lg`
					: "border border-transparent hover:border-gray-900"
			} ${hasError && isActive && "outline-danger border-transparent outline-4"}`}
			role="radio"
		>
			<Icon color={iconColor} size={32} />
			<span className="mt-1.5 font-semibold text-black">
				{value === "expense" ? "Despesa" : "Receita"}
			</span>
			<input
				type="radio"
				value={value}
				{...register(name)}
				className="absolute inset-0 cursor-pointer opacity-0"
			/>
		</label>
	);
}
