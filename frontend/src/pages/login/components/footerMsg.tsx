interface FooterMsgProps {
	label: string;
	linkText: string;
	onFocus?: () => void;
	onClick?: () => void;
	disabled: boolean;
}

export default function FooterMsg({
	label,
	linkText,
	onClick,
	onFocus,
	disabled,
}: FooterMsgProps) {
	return (
		<section className="flex gap-2">
			<span>{label}</span>
			<button
				type="button"
				onFocus={onFocus}
				onClick={onClick}
				disabled={disabled}
				className="text-secondary hover:text-primary cursor-pointer font-bold transition duration-1000 disabled:cursor-not-allowed"
			>
				{linkText}
			</button>
		</section>
	);
}
