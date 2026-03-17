export default function RouterLoader() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-500">
			<div className="size-24 animate-spin rounded-full border-4 border-white border-b-black" />
			<h1 className="mt-5 animate-bounce text-xl font-bold text-white">
				Carregando...
			</h1>
		</div>
	);
}
