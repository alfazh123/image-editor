'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	YAxis,
} from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getBenchmarkData } from "./func";
import { BenchmarkResultProps, TransferColorAttempt } from "../menu/type";
import { ColumnDef } from "@tanstack/react-table";
import LogTable from "@/components/log-table";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";

export const columns: ColumnDef<BenchmarkResultProps>[] = [
	{
		accessorKey: "method",
		header: "Method",
	},
	// {
	// 	accessorKey: "latency",
	// 	header: "Latency (ms)",
	// 	cell: ({ row }) => {
	// 		return row.original.latency === 0
	// 			? "No Latency"
	// 			: `${row.original.latency.toFixed(2)} ms`;
	// 	},
	// },
	{
		accessorKey: "downloadSpeed",
		header: "Download Speed (Mbps)",
		cell: ({ row }) => {
			return row.original.downloadSpeed === 0 ||
				row.original.downloadSpeed === undefined
				? "N/A"
				: `${row.original.downloadSpeed.toFixed(2)} Mbps`;
		},
	},
	{
		accessorKey: "uploadSpeed",
		header: "Upload Speed (Mbps)",
		cell: ({ row }) => {
			return row.original.uploadSpeed === 0 ||
				row.original.uploadSpeed === undefined
				? "N/A"
				: `${row.original.uploadSpeed.toFixed(2)} Mbps`;
		},
	},
	{
		accessorKey: "time",
		header: "Time Execute (ms)",
		cell: ({ row }) => {
			return row.original.time === 0
				? "undefined"
				: `${row.original.time.toFixed(2)} ms`;
		},
	},
	{
		accessorKey: "date",
		header: "Date",
	},
];

export default function BenchmarkContent() {
	const [parsedDataWasm, setParsedDataWasm] = useState<BenchmarkResultProps[]>(
		[]
	);
	const [parsedDataNative, setParsedDataNative] = useState<
		BenchmarkResultProps[]
	>([]);
	const [colTransferData, setColTransferData] = useState<
		TransferColorAttempt[]
	>([]);
	const [sizeWasm, setSizeWasm] = useState<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});
	const [sizeNative, setSizeNative] = useState<{
		width: number;
		height: number;
	}>({
		width: 0,
		height: 0,
	});
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Hanya dijalankan di client
		const dataWasm = localStorage.getItem("benchmarkWASM");

		const dataNative = localStorage.getItem("benchmarkNative");

		const colorTransferAttempts = localStorage.getItem("transferColorAttemp");

		setParsedDataWasm(dataWasm ? JSON.parse(dataWasm) : []);
		setParsedDataNative(dataNative ? JSON.parse(dataNative) : []);
		setColTransferData(
			colorTransferAttempts ? JSON.parse(colorTransferAttempts) : []
		);
		setSizeWasm({
			width: JSON.parse(dataWasm ?? "[]")[0]?.width,
			height: JSON.parse(dataWasm ?? "[]")[0]?.height,
		});
		setSizeNative({
			width: JSON.parse(dataNative ?? "[]")[0]?.width,
			height: JSON.parse(dataNative ?? "[]")[0]?.height,
		});
		setIsLoaded(true);
	}, []);

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center min-h-screen px-4">
				<div className="mx-auto max-w-4xl p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg border border-blue-200">
					<h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow">
						Loading Benchmark Data...
					</h1>
					<p className="text-gray-700 mb-2 text-lg">
						Please wait while we load the benchmark data.
					</p>
				</div>
			</div>
		);
	}

	if (parsedDataWasm.length === 0 || parsedDataNative.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen px-4">
				<div className="mx-auto max-w-4xl p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg border border-blue-200">
					<h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow">
						{!parsedDataWasm.length
							? "No WASM Benchmark Data"
							: "No Native Benchmark Data"}
					</h1>
					<p className="text-gray-700 mb-2 text-lg">
						{!parsedDataWasm.length
							? "No WASM benchmark data found."
							: "No Native benchmark data found."}{" "}
						Please run the benchmark tests first by click link bellow.
					</p>
					<Link
						href={!parsedDataWasm.length ? "/wasm" : "/native"}
						className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
						Go Edits
					</Link>
				</div>
			</div>
		);
	}
	if (parsedDataWasm.length != 0) {
		const { benchmarkData: benchmarkDataWasm } = getBenchmarkData(
			parsedDataWasm,
			colTransferData,
			"WASM"
		);
		const { benchmarkData: benchmarkDataNative } = getBenchmarkData(
			parsedDataNative,
			colTransferData,
			"NATIVE"
		);

		const benchmarkConfig = {
			wasm: {
				label: "WASM",
				color: "#2563eb",
			},
			native: {
				label: "Actix",
				color: "#FF8528",
			},
		} satisfies ChartConfig;

		return (
			<div>
				<Navbar />
				<div className="p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg border border-blue-200">
					<div className="grid grid-cols-2 gap-8">
						<div>
							<h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow">
								Benchmark WASM Results
							</h1>
							<p className="text-gray-600 mb-8 text-base">
								You can save this page as a complete webpage to keep the result
								with
								<span className="font-semibold text-blue-700"> CTRL + S</span>.
								<br /> This result is based on benchmark image with size{" "}
								<span className="font-semibold text-blue-700">
									{sizeWasm.width}px X {sizeWasm.height}px
								</span>
								.
							</p>
							<div className="flex flex-col gap-8 mb-10">
								{benchmarkDataWasm &&
									benchmarkDataWasm.map((benchmark, id) => (
										<Card
											key={id}
											className="border border-blue-200 shadow-md bg-white/80 hover:shadow-lg transition-shadow">
											<CardHeader>
												<CardTitle className="text-2xl font-bold text-blue-700">
													Benchmark {benchmark.name}
												</CardTitle>
												<CardDescription className="text-gray-500">
													This process had an average execution time of{" "}
													{/* <span className="font-semibold text-blue-700">
														{benchmark.mean.toFixed(2)} seconds
													</span> */}
													<br />
													{/* {((benchmark.data[0].latency &&
														benchmark.data[0].latency !== undefined) ||
														benchmark.data[0].latency > 0) && (
														<div className="flex flex-col gap-2">
															<span>
																Latency:
																<span className="font-semibold text-blue-700">
																	{benchmark.data[0].latency.toFixed(2)} ms
																</span>
															</span>
															<span>
																Download:
																<span className="font-semibold text-blue-700">
																	{benchmark.data[0].downloadSpeed.toFixed(2)}{" "}
																	MB
																</span>
															</span>
															<span>
																Upload:
																<span className="font-semibold text-blue-700">
																	{benchmark.data[0].uploadSpeed.toFixed(2)} MB
																</span>
															</span>
														</div>
													)} */}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<ChartContainer
													config={benchmarkConfig}
													className="h-full w-full">
													<BarChart
														accessibilityLayer
														data={benchmark.data}
														outerRadius={10}
														innerRadius={10}
														margin={{
															top: 20,
															right: 30,
															left: 20,
															bottom: 20,
														}}>
														<CartesianGrid
															vertical={false}
															strokeDasharray="3 3"
														/>
														<ChartTooltip content={<ChartTooltipContent />} />
														<XAxis
															dataKey={`${
																benchmark.name === "Color Transfer"
																	? "referenceSize"
																	: "label"
															}`}
															axisLine={false}
															tickLine={false}
															tickMargin={10}
															className="text-gray-700 font-medium"
															label={{
																value: `${
																	benchmark.name === "Color Transfer"
																		? "Image Reference Size"
																		: "Iteration"
																}`,
																position: "insideBottom",
																offset: -10,
																fill: "var(--muted-foreground)",
																fontWeight: 600,
															}}
														/>
														<YAxis
															dataKey={"time"}
															axisLine={false}
															tickLine={false}
															tickMargin={10}
															className="text-gray-700 font-medium"
															label={{
																value: "Time (seconds)",
																angle: -90,
																position: "insideLeft",
																offset: 10,
																fill: "var(--muted-foreground)",
																fontWeight: 600,
															}}
														/>
														<Bar
															dataKey="time"
															fill={`var(--color-wasm)`}
															radius={6}>
															<LabelList
																position="top"
																offset={12}
																className="fill-foreground"
																fontSize={12}
															/>
														</Bar>
													</BarChart>
												</ChartContainer>
											</CardContent>
										</Card>
									))}
							</div>

							{/* Log Table WASM */}
							<div className="mt-8 bg-white rounded-lg shadow border border-blue-100 p-4">
								<LogTable columns={columns} data={parsedDataWasm} />
							</div>
						</div>

						<div>
							<h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow">
								Benchmark Native Results
							</h1>

							<p className="text-gray-600 mb-8 text-base">
								You can save this page as a complete webpage to keep the result
								with
								<span className="font-semibold text-blue-700"> CTRL + S</span>.
								<br /> This result is based on benchmark image with size{" "}
								<span className="font-semibold text-blue-700">
									{sizeNative.width}px X {sizeNative.height}px
								</span>
								.
							</p>
							<div className="flex flex-col gap-8 mb-10">
								{benchmarkDataNative &&
									benchmarkDataNative.map((benchmark, id) => (
										<Card
											key={id}
											className="border border-blue-200 shadow-md bg-white/80 hover:shadow-lg transition-shadow">
											<CardHeader>
												<CardTitle className="text-2xl font-bold text-blue-700">
													Benchmark {benchmark.name}
												</CardTitle>
												<CardDescription className="text-gray-500">
													This process had an average execution time of{" "}
													{/* <span className="font-semibold text-blue-700">
														{benchmark.mean.toFixed(2)} seconds
													</span>
													<br />
													{((benchmark.data[0].latency &&
														benchmark.data[0].latency !== undefined) ||
														benchmark.data[0].latency > 0) && (
														<div className="flex flex-col gap-2">
															<span>
																Latency:
																<span className="font-semibold text-blue-700">
																	{benchmark.data[0].latency.toFixed(2)} ms
																</span>
															</span>
															<span>
																Download:
																<span className="font-semibold text-blue-700">
																	{benchmark.data[0].downloadSpeed.toFixed(2)}{" "}
																	MB
																</span>
															</span>
															<span>
																Upload:
																<span className="font-semibold text-blue-700">
																	{benchmark.data[0].uploadSpeed.toFixed(2)} MB
																</span>
															</span>
														</div>
													)} */}
												</CardDescription>
											</CardHeader>
											<CardContent>
												<ChartContainer
													config={benchmarkConfig}
													className="h-full w-full">
													<BarChart
														accessibilityLayer
														data={benchmark.data}
														outerRadius={10}
														innerRadius={10}
														margin={{
															top: 20,
															right: 30,
															left: 20,
															bottom: 20,
														}}>
														<CartesianGrid
															vertical={false}
															strokeDasharray="3 3"
														/>
														<ChartTooltip content={<ChartTooltipContent />} />
														<XAxis
															dataKey={`${
																benchmark.name === "Color Transfer"
																	? "referenceSize"
																	: "label"
															}`}
															axisLine={false}
															tickLine={false}
															tickMargin={10}
															className="text-gray-700 font-medium"
															label={{
																value: `${
																	benchmark.name === "Color Transfer"
																		? "Image Reference Size"
																		: "Iteration"
																}`,
																position: "insideBottom",
																offset: -10,
																fill: "var(--muted-foreground)",
																fontWeight: 600,
															}}
														/>
														<YAxis
															dataKey={"time"}
															axisLine={false}
															tickLine={false}
															tickMargin={10}
															className="text-gray-700 font-medium"
															label={{
																value: "Time (seconds)",
																angle: -90,
																position: "insideLeft",
																offset: 10,
																fill: "var(--muted-foreground)",
																fontWeight: 600,
															}}
														/>
														<Bar
															dataKey="time"
															fill={`var(--color-native)`}
															radius={6}>
															<LabelList
																position="top"
																offset={12}
																className="fill-foreground"
																fontSize={12}
															/>
														</Bar>
													</BarChart>
												</ChartContainer>
											</CardContent>
										</Card>
									))}
							</div>
							{/* Log Table Native */}
							<div className="mt-8 bg-white rounded-lg shadow border border-blue-100 p-4">
								<LogTable columns={columns} data={parsedDataNative} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
