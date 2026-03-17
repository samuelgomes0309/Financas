import { useContext } from "react";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { AuthContext } from "../../contexts/authContext";

export default function Profile() {
	const { user } = useContext(AuthContext)!;
	return (
		<div className="bg-background-light flex min-h-screen min-w-full flex-col md:flex-row">
			<Sidebar />
			<main className="flex w-full flex-col">
				<Header title="Perfil" />
				<section className="p-4">
					<div className="rounded-xl border border-gray-400 bg-white px-4 py-6 shadow-2xl">
						<span className="text-xl font-bold">Nome:</span>
						<span className="my-2 block w-full max-w-xs cursor-not-allowed truncate rounded-2xl bg-white px-4 py-1 outline">
							{user?.name}
						</span>
						<span className="my-2 text-xl font-bold">Email:</span>
						<span className="my-2 block w-full max-w-xs cursor-not-allowed truncate rounded-2xl bg-white px-4 py-1 outline">
							{user?.email}
						</span>
					</div>
				</section>
			</main>
		</div>
	);
}
