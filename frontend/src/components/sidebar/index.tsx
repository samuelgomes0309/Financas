import { Home, ListPlus, LogOut, UserRoundPen, Wallet } from "lucide-react";
import ItemLink from "./components/itemLink";
import { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";

export default function Sidebar() {
	const { logOut } = useContext(AuthContext)!;
	return (
		<div className="flex min-h-12 w-full flex-row border-b border-gray-300 bg-white p-2 shadow-xl md:min-h-screen md:max-w-64 md:flex-col md:border-r md:p-4">
			<div className="mr-2 flex items-center gap-5 p-4 md:mr-0">
				<div className="bg-success flex min-h-8 min-w-8 items-center justify-center rounded-sm">
					<Wallet color="#F4f4f4" />
				</div>
				<h1 className="hidden font-bold italic md:flex md:text-xl">Finanças</h1>
			</div>
			<div className="my-5 hidden border-b-2 border-gray-400 md:block"></div>
			<div className="flex flex-1 gap-2 md:flex-col">
				<ItemLink icon={Home} label="Dashboard" linkTo="/" />
				<ItemLink icon={ListPlus} label="Registrar" linkTo="/register" />
			</div>
			<div className="my-5 hidden border-b-2 border-gray-400 md:block"></div>
			<div className="flex gap-2 md:flex-col">
				<ItemLink icon={UserRoundPen} label="Perfil" linkTo="/profile" />
				<button
					type="button"
					onClick={logOut}
					className="hover:border-danger hover:text-danger flex cursor-pointer items-center gap-5 rounded-2xl border border-transparent px-5 py-2 transition duration-300"
				>
					<LogOut />
					<span className="hidden md:block">Sair</span>
				</button>
			</div>
		</div>
	);
}
