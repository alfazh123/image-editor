'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { useSearchParams } from "next/navigation";
import { getBenchmarkData } from "./func";
import { BenchmarkResultProps, TransferColorAttempt } from "../menu/type";
import { ColumnDef } from "@tanstack/react-table";
import LogTable from "@/components/log-table";
import { useEffect, useState } from "react";
import Link from "next/link";

export const columns: ColumnDef<BenchmarkResultProps>[] = [
	{
		accessorKey: "method",
		header: "Method",
	},
	{
		accessorKey: "latency",
		header: "Latency (ms)",
		cell: ({ row }) => {
			return row.original.latency === 0
				? "No Latency"
				: `${row.original.latency.toFixed(2)} ms`;
		},
	},
	{
		accessorKey: "time",
		header: "Time Execute (ms)",
		cell: ({ row }) => {
			return row.original.time === 0
				? "No Latency"
				: `${row.original.time.toFixed(2)} ms`;
		},
	},
	{
		accessorKey: "date",
		header: "Date",
	},
];

export const columnsWithNoLatency: ColumnDef<BenchmarkResultProps>[] = [
	{
		accessorKey: "method",
		header: "Method",
	},
	{
		accessorKey: "time",
		header: "Time Execute (ms)",
		cell: ({ row }) => {
			return row.original.time === 0
				? "No Latency"
				: `${row.original.time.toFixed(2)} ms`;
		},
	},
	{
		accessorKey: "date",
		header: "Date",
	},
];

export default function BenchmarkContent() {
	const searchParams = useSearchParams();
	const type = searchParams.get("type");
	const [parsedData, setParsedData] = useState<BenchmarkResultProps[]>([]);
	const [colTransferData, setColTransferData] = useState<
		TransferColorAttempt[]
	>([]);
	const [size, setSize] = useState<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Hanya dijalankan di client
		const data =
			type === "wasm"
				? localStorage.getItem("benchmarkWASM")
				: localStorage.getItem("benchmarkNative");

		const colorTransferAttempts = localStorage.getItem("transferColorAttemp");

		setParsedData(data ? JSON.parse(data) : []);
		setColTransferData(
			colorTransferAttempts ? JSON.parse(colorTransferAttempts) : []
		);
		setSize({
			width: JSON.parse(data ?? "[]")[0]?.width,
			height: JSON.parse(data ?? "[]")[0]?.height,
		});
		setIsLoaded(true);
	}, [type]);

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

	if (parsedData.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen px-4">
				<div className="mx-auto max-w-4xl p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg border border-blue-200">
					<h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow">
						No Benchmark Data
					</h1>
					<p className="text-gray-700 mb-2 text-lg">
						No benchmark data found. Please run the benchmark tests first.
					</p>
					<Link
						href={`/`}
						className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
						Go Edits
					</Link>
				</div>
			</div>
		);
	}
	if (parsedData.length != 0) {
		colTransferData.filter(
			(item: { type: string }) => item.type.toLowerCase() === type
		);

		const { benchmarkData } = getBenchmarkData(parsedData, colTransferData);

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
			<div className="mx-auto max-w-4xl p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg border border-blue-200">
				<h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow">
					Benchmark Results
				</h1>
				<p className="text-gray-700 mb-2 text-lg">
					This page displays the results of benchmark tests for various image
					processing methods. Benchmarks are divided into two types: execution
					time and execution time compared to latency.
				</p>
				<p className="text-gray-600 mb-8 text-base">
					You can save this page as a complete webpage to keep the result with
					<span className="font-semibold text-blue-700"> CTRL + S</span>. This
					result is based on benchmark image with size{" "}
					<span className="font-semibold text-blue-700">
						{size.width}px X {size.height}px
					</span>
					.
				</p>
				<div className="flex flex-col gap-8 mb-10">
					{benchmarkData &&
						benchmarkData.map((benchmark, id) => (
							<Card
								key={id}
								className="border border-blue-200 shadow-md bg-white/80 hover:shadow-lg transition-shadow">
								<CardHeader>
									<CardTitle className="text-2xl font-bold text-blue-700">
										Benchmark {benchmark.name}
									</CardTitle>
									<CardDescription className="text-gray-500">
										This chart shows the time execution of various image
										processing methods.
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
											margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
											<CartesianGrid vertical={false} strokeDasharray="3 3" />
											<ChartTooltip content={<ChartTooltipContent />} />
											<XAxis
												dataKey={`${
													benchmark.name === "Color Transfer"
														? "referenceSize"
														: "time"
												}`}
												axisLine={false}
												tickLine={false}
												tickMargin={10}
												tickFormatter={(value) => value.slice(0.3)}
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
												fill={`var(--color-${type})`}
												radius={6}></Bar>
										</BarChart>
									</ChartContainer>
								</CardContent>
							</Card>
						))}
				</div>

				{/* Log Table */}
				<div className="mt-8 bg-white rounded-lg shadow border border-blue-100 p-4">
					<LogTable
						columns={columns}
						data={parsedData}
						columnsWithNoLatency={columnsWithNoLatency}
					/>
				</div>
			</div>
		);
	}
}
