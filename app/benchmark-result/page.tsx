import { Suspense } from "react";
// import BenchmarkContent from "./becnhmark-content";
import BenchmarkContentDouble from "./benchmark-content-double";

export default function BenchmarkResult() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			{/* <BenchmarkContent /> */}
			<BenchmarkContentDouble />
		</Suspense>
	);
}
