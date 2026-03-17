import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";

interface HeaderProps {
	title: string;
}

export default function Header({ title }: HeaderProps) {
	const { user } = useContext(AuthContext)!;
	return (
		<header className="m-0 flex max-h-16 min-w-full items-center justify-between border-y border-gray-400 bg-white p-10 md:mr-64 md:border-b">
			<span className="font-bold"> {title}</span>
			<div className="flex max-w-28 flex-col items-center justify-center">
				<span className="block w-28 truncate font-semibold">{user?.name}</span>
				<span>{user?.email}</span>
			</div>
		</header>
	);
}
