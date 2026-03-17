import { type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface ItemLinkProps {
	label: string;
	icon: LucideIcon;
	linkTo: string;
}

export default function ItemLink({ linkTo, label, icon: Icon }: ItemLinkProps) {
	const location = useLocation();
	return (
		<Link
			to={linkTo}
			className={` ${
				location.pathname === linkTo
					? "hover:bg-primary text-primary border-secondary border font-bold hover:text-white"
					: "bg-transparent"
			} flex items-center gap-5 rounded-2xl px-5 py-2 transition duration-300 hover:bg-gray-300`}
		>
			<Icon size={20} />
			<span className="hidden md:block">{label}</span>
		</Link>
	);
}
