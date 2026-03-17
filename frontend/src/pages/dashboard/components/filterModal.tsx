import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface FilterModalProps {
	modalVisible: () => void;
	onChange: (value: Date | null) => void;
	value: Date | null;
	filter: () => void;
	loading: boolean;
}

export default function FilterModal({
	modalVisible,
	onChange,
	value,
	filter,
	loading,
}: FilterModalProps) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
			onClick={modalVisible}
		>
			<div
				className="bg-background-light relative z-50 flex max-w-3xl flex-col items-center justify-center gap-5 rounded-xl px-5 py-6"
				onClick={(e) => e.stopPropagation()}
			>
				<span className="text-xl font-bold">Selecione uma data</span>
				{loading ? (
					<div className="size-16 animate-spin rounded-full border-4 border-gray-400 border-b-transparent" />
				) : (
					<Calendar
						value={value}
						onChange={(newDate) => onChange(newDate as Date | null)}
						maxDate={new Date()}
						selectRange={false}
					/>
				)}
				<div className="flex gap-2">
					<button
						className="bg-primary hover:bg-primary/75 w-24 cursor-pointer rounded-xl p-2 text-white transition duration-1000 disabled:cursor-not-allowed disabled:bg-gray-500 hover:disabled:bg-gray-500"
						type="button"
						onClick={filter}
						disabled={loading}
					>
						Selecionar
					</button>
					<button
						onClick={modalVisible}
						type="button"
						disabled={loading}
						className="bg-danger hover:bg-danger/75 w-24 cursor-pointer rounded-xl p-2 text-white transition duration-300 disabled:cursor-not-allowed disabled:bg-gray-500 hover:disabled:bg-gray-500"
					>
						Sair
					</button>
				</div>
			</div>
		</div>
	);
}
