import { Filter, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import Header from "../../components/header";
import Sidebar from "../../components/sidebar";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import CardBalance from "./components/cardBalance";
import CardItem from "./components/cardItem";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import FilterModal from "./components/filterModal";

export interface BalanceData {
	balance: number;
	revenue: {
		items: [];
		total: number;
	};
	expense: {
		items: [];
		total: number;
	};
}

export interface TransactionItemProps {
	id: string;
	type: string;
	date: string;
	description: string;
	user_id: string;
	value: number;
}

export default function Dashboard() {
	const [balance, setBalance] = useState<BalanceData | null>(null);
	const [loadingFilter, setLoadingfilter] = useState<boolean>(false);
	const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);
	const [date, setDate] = useState<string>(
		new Date().toLocaleDateString("pt-br")
	);
	const [filterDate, setFilterDate] = useState<Date | null>(new Date());
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	useEffect(() => {
		const sub = () => {
			Promise.all([handleSearchBalance(), handleSearchTransactions()]);
		};
		sub();
	}, []);
	async function handleSearchBalance(paramDate?: string) {
		try {
			const response = await api.get<BalanceData>("/users/balance", {
				params: {
					date: paramDate || new Date().toLocaleDateString("pt-br"),
				},
			});
			setBalance(response?.data);
		} catch (error: any) {
			console.log(error?.message);
		}
	}
	async function handleFilter() {
		try {
			if (filterDate == null) {
				toast.error("Data não encontrada");
				return;
			}
			setLoadingfilter(true);
			const filter = filterDate.toLocaleDateString("pt-br");
			if (filter === date) {
				toast.error("Selecione uma data menor que a data atual.");
				return;
			}
			await handleSearchTransactions(filter);
			await handleSearchBalance(filter);
			setDate(filter);
			setModalVisible(false);
		} catch (error: any) {
			console.log(error?.message);
		} finally {
			setLoadingfilter(false);
		}
	}
	async function handleSearchTransactions(paramDate?: string) {
		try {
			const response = await api.get<TransactionItemProps[]>("/transactions", {
				params: {
					date: paramDate || date,
				},
			});
			if (response.data.length <= 0) {
				setTransactions([]);
				return;
			}
			setTransactions(response.data);
		} catch (error: any) {
			console.log(error?.message);
		}
	}
	async function handleDeleteItem(item_id: string) {
		if (!item_id) {
			toast.error("Id da transação não encontrado.");
		}
		try {
			await api.delete("/transactions/delete", {
				params: {
					item_id: item_id,
				},
			});
			await handleSearchTransactions(date);
			await handleSearchBalance(date);
		} catch (error: any) {
			console.log(error?.message);
		}
	}
	return (
		<div className="bg-background-light flex min-h-screen min-w-full flex-col md:flex-row">
			<Sidebar />
			<main className="flex w-full flex-col">
				<Header title="Dashboard" />
				<section className="flex flex-col gap-6 p-4 sm:flex-row">
					<CardBalance
						icon={Wallet}
						balance={balance}
						type="balance"
						label="Saldo Total"
					/>
					<CardBalance
						icon={TrendingUp}
						balance={balance}
						type="revenue"
						label="Receitas do dia"
					/>
					<CardBalance
						icon={TrendingDown}
						balance={balance}
						type="expense"
						label="Despesas do dia"
					/>
				</section>
				<section className="flex flex-col p-4">
					<div className="rounded-xl border border-gray-400 bg-white px-4 py-6 shadow-2xl">
						<section className="flex w-full justify-between border-b border-gray-500 py-2">
							<div className="flex flex-col md:flex-row">
								<h1>Transações Recentes </h1>
								<span className="text-primary ml-0 md:ml-1">{date}</span>
							</div>
							<div className="flex gap-1.5">
								<Link
									to="/register"
									className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl border border-gray-300 bg-white px-4 py-2 shadow transition duration-300 hover:bg-gray-200"
								>
									<Plus />
									Nova
								</Link>
								<button
									type="button"
									onClick={() => setModalVisible(true)}
									className="flex cursor-pointer items-center justify-center gap-1 rounded-2xl border border-gray-300 bg-white px-4 py-2 shadow transition duration-300 hover:bg-gray-200"
								>
									<Filter />
									Filtro
								</button>
							</div>
						</section>
						<section className="flex w-full flex-col justify-between">
							{transactions?.length !== 0 &&
								transactions?.map((item) => (
									<CardItem
										transaction={item}
										key={item.id}
										deleteItem={handleDeleteItem}
									/>
								))}
							{transactions?.length === 0 && (
								<div className="text-danger mt-5 flex items-center justify-center font-bold">
									<span>Não possui transações na data de {date}.</span>
								</div>
							)}
						</section>
					</div>
				</section>
			</main>
			{modalVisible && (
				<FilterModal
					modalVisible={() => setModalVisible(false)}
					onChange={setFilterDate}
					value={filterDate}
					filter={() => handleFilter()}
					loading={loadingFilter}
				/>
			)}
		</div>
	);
}
