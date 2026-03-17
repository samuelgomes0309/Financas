import { Wallet } from "lucide-react";

interface HeaderMsgProps {
	title?: string;
	subtitle: string;
}

export default function HeaderMsg({
	subtitle,
	title = "Bem-Vindo",
}: HeaderMsgProps) {
	return (
		<section className="flex h-full w-full flex-col items-center p-5">
			<div className="bg-success flex h-14 w-14 items-center justify-center rounded-2xl">
				<Wallet size={30} color="#F4f4f4" />
			</div>
			<h1 className="my-4 text-2xl font-bold text-black">{title}</h1>
			<h4 className="mb-4 font-light text-black">{subtitle}</h4>
		</section>
	);
}
