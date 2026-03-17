interface SubmitBtnProps {
	label: string;
	disabled: boolean;
}

export default function SubmitBtn({ label, disabled }: SubmitBtnProps) {
	const Spiner = () => {
		return (
			<div className="border-primary size-6 animate-spin rounded-full border-2 border-b-white" />
		);
	};
	return (
		<button
			type="submit"
			disabled={disabled}
			className="bg-primary hover:bg-secondary my-4 flex w-full cursor-pointer items-center justify-center rounded-xl p-2 font-black text-white transition duration-1000 disabled:cursor-not-allowed disabled:bg-gray-500 hover:disabled:bg-gray-500"
		>
			{disabled ? <Spiner /> : label}
		</button>
	);
}
