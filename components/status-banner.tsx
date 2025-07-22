interface StatusBannerProps {
	initialized: boolean;
	error?: string | null;
	title: string;
}

export function StatusBanner({initialized, error, title}: StatusBannerProps) {
    return (
        <div className="flex flex-col justify-center h-45 items-center z-100 mt-40">
			<h1 className="text-center text-2xl font-bold text-gray-600 mb-4">
				{title}
			</h1>

			{!initialized && !error && (
				<p className="text-sm text-yellow-500">
					🔄 Initializing WASM...
				</p>
			)}
			{error && (
				<p className="text-sm text-red-500">
					❌ WASM Error: {error}
				</p>
			)}
			{initialized && (
				<p className="text-sm text-green-500">✅ WASM Ready</p>
			)}
		</div>
    )
}