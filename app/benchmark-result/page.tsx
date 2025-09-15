import { Suspense } from "react";
import BenchmarkContent from "./becnhmark-content";

export default function BenchmarkResult() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<BenchmarkContent />
		</Suspense>
	);
}
