import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Path, UseFormRegister } from "react-hook-form";
import type { RegisterFormInput } from "../schema";

interface InputRegProps {
	onFocus: () => void;
	onBlur: () => void;
	icon: LucideIcon;
	register: UseFormRegister<RegisterFormInput>;
	name: Path<RegisterFormInput>;
	fieldFocus: string | null;
	error?: string;
	placeholder: string;
	type: string;
	children?: ReactNode;
}

export default function InputReg({
	icon: Icon,
	type,
	fieldFocus,
	error,
	children,
	onBlur,
	onFocus,
	name,
	register,
	placeholder,
}: InputRegProps) {
	return (
		<div
			className={`bg-background-light flex h-10 items-center gap-1 rounded-xl px-1 text-gray-400 shadow ${fieldFocus === name && !error ? "outline-primary outline-2" : ""} ${error && "outline-danger outline-2"}`}
		>
			<Icon />
			<input
				type={type}
				className="h-full flex-1 py-0.5 pr-2.5 pl-1 font-semibold text-black placeholder-zinc-500 outline-none"
				placeholder={placeholder}
				{...register(name)}
				onBlur={onBlur}
				onFocus={onFocus}
			/>
			{children}
		</div>
	);
}
