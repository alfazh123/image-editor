'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	LabelList,
	Area,
	AreaChart,
	YAxis,
	LineChart,
	Line,
} from "recharts";

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useState } from "react";

const benchmarkData = [
	{
		process: "Transfer Color",
		wasm: 0.32,
		native: 0.21,
		benchmarkType: "time-execute",
	},
	{
		process: "Sharpness",
		wasm: 0.28,
		native: 0.19,
		benchmarkType: "time-execute",
	},
	{
		process: "Saturation",
		wasm: 0.35,
		native: 0.23,
		benchmarkType: "time-execute",
	},
	{
		process: "Temperature",
		wasm: 0.3,
		native: 0.2,
		benchmarkType: "time-execute",
	},
	{ process: "Tint", wasm: 0.27, native: 0.18, benchmarkType: "time-execute" },
	{
		process: "Contrast",
		wasm: 0.33,
		native: 0.22,
		benchmarkType: "time-execute",
	},
	{
		process: "Exposure",
		wasm: 0.29,
		native: 0.2,
		benchmarkType: "time-execute",
	},
	{
		process: "Transfer Color",
		wasm: 0.45,
		native: 0.31,
		benchmarkType: "time-execute-internet",
	},
	{
		process: "Sharpness",
		wasm: 0.41,
		native: 0.29,
		benchmarkType: "time-execute-internet",
	},
	{
		process: "Saturation",
		wasm: 0.48,
		native: 0.34,
		benchmarkType: "time-execute-internet",
	},
	{
		process: "Temperature",
		wasm: 0.43,
		native: 0.3,
		benchmarkType: "time-execute-internet",
	},
	{
		process: "Tint",
		wasm: 0.39,
		native: 0.27,
		benchmarkType: "time-execute-internet",
	},
	{
		process: "Contrast",
		wasm: 0.46,
		native: 0.32,
		benchmarkType: "time-execute-internet",
	},
	{
		process: "Exposure",
		wasm: 0.42,
		native: 0.28,
		benchmarkType: "time-execute-internet",
	},
];

const benchmarkCPUData = [
	{ wasm: 42.7, native: 51.5, server: 96.3 },
	{ wasm: 60.4, native: 20.5, server: 100.3 },
	{ wasm: 77.4, native: 7.9, server: 35.9 },
	{ wasm: 82.7, native: 26.9, server: 56.3 },
	{ wasm: 54.9, native: 77.0, server: 94 },
	{ wasm: 90.3, native: 11.9, server: 36 },
	{ wasm: 68.8, native: 12.0, server: 115.3 },
	{ wasm: 101.4, native: 16.3, server: 567.4 },
	{ wasm: 37.8, native: 21.5, server: 601.3 },
	{ wasm: 101.8, native: 2.8, server: 598.7 },
	{ wasm: 64.3, native: 7.5, server: 599.3 },
	{ wasm: 40.6, native: 22.3, server: 601.7 },
	{ wasm: 61.9, native: 21.3, server: 599 },
	{ wasm: 57.3, native: 9.0, server: 600.7 },
	{ wasm: 58.6, native: 12.7, server: 177.3 },
	{ wasm: 73.4, native: 23.4, server: 2.3 },
	{ wasm: 36.8, native: 50.8, server: 113.3 },
	{ wasm: 16.4, native: 39.7, server: 216.3 },
	{ wasm: 37.2, native: 41.2, server: 105 },
	{ wasm: 57.2, native: 18.6, server: 59 },
	{ wasm: 46.1, native: 12.0, server: 87.4 },
	{ wasm: 30.7, native: 7.0, server: 182.1 },
	{ wasm: 18.7, native: 2.2, server: 112 },
	{ wasm: 31.0, native: 42.3, server: 136.9 },
	{ wasm: 87.0, native: 24.6, server: 12 },
	{ wasm: 89.4, native: 34.7, server: 177.3 },
	{ wasm: 40.6, native: 51.7, server: 177.3 },
	{ wasm: 73.4, native: 50.7, server: 97 },
	{ wasm: 91.3, native: 55.8, server: 174.3 },
	{ wasm: 43.6, native: 52.2, server: 169 },
	{ wasm: 3.5, native: 37.2, server: 66.3 },
	{ wasm: 3.8, native: 20.8, server: 99.7 },
	{ wasm: 20.0, native: 28.6, server: 305.6 },
	{ wasm: 27.3, native: 59.6, server: 188.3 },
	{ wasm: 87.8, native: 37.4, server: 160.8 },
	{ wasm: 87.0, native: 8.8, server: 250.2 },
	{ wasm: 31.0, native: 12.7, server: 10.7 },
	{ wasm: 73.8, native: 16.4, server: 115.3 },
	{ wasm: 21.1, native: 15.7, server: 28.9 },
	{ wasm: 20.5, native: 55.2, server: 125.7 },
	{ wasm: 11.5, native: 49.1, server: 212.3 },
	{ wasm: 30.2, native: 35.0, server: null },
	{ wasm: 86.4, native: 56.2, server: null },
	{ wasm: 68.9, native: 27.2, server: null },
	{ wasm: 74.2, native: 32.4, server: null },
	{ wasm: 77.7, native: 13.8, server: null },
	{ wasm: 79.2, native: 22.0, server: null },
	{ wasm: 78.9, native: 29.4, server: null },
	{ wasm: 52.2, native: 55.2, server: null },
	{ wasm: 30.8, native: 47.7, server: null },
	{ wasm: 76.4, native: 71.1, server: null },
	{ wasm: 73.0, native: 14.6, server: null },
	{ wasm: 87.9, native: 21.2, server: null },
	{ wasm: 48.8, native: 0.1, server: null },
	{ wasm: 47.9, native: 0.0, server: null },
	{ wasm: 78.9, native: 13.2, server: null },
	{ wasm: 89.9, native: 10.7, server: null },
	{ wasm: 94.2, native: 27.0, server: null },
	{ wasm: 70.7, native: 48.7, server: null },
	{ wasm: 96.2, native: 5.7, server: null },
	{ wasm: 70.0, native: 52.4, server: null },
	{ wasm: 90.1, native: 23.0, server: null },
	{ wasm: 95.7, native: 19.0, server: null },
	{ wasm: 62.8, native: 32.7, server: null },
	{ wasm: 96.0, native: 67.8, server: null },
	{ wasm: 69.8, native: 33.3, server: null },
	{ wasm: 47.1, native: 47.0, server: null },
	{ wasm: 66.0, native: 24.5, server: null },
	{ wasm: 59.3, native: 24.4, server: null },
	{ wasm: 49.3, native: 22.1, server: null },
];

const benchmarkCPUDataServer = [
	{ wasm: 42.7, native: 51.5, server: 96.3 },
	{ wasm: 60.4, native: 20.5, server: 100.3 },
	{ wasm: 77.4, native: 7.9, server: 35.9 },
	{ wasm: 82.7, native: 26.9, server: 56.3 },
	{ wasm: 54.9, native: 77.0, server: 94 },
	{ wasm: 90.3, native: 11.9, server: 36 },
	{ wasm: 68.8, native: 12.0, server: 115.3 },
	{ wasm: 101.4, native: 16.3, server: 567.4 },
	{ wasm: 37.8, native: 21.5, server: 601.3 },
	{ wasm: 101.8, native: 2.8, server: 598.7 },
	{ wasm: 64.3, native: 7.5, server: 599.3 },
	{ wasm: 40.6, native: 22.3, server: 601.7 },
	{ wasm: 61.9, native: 21.3, server: 599 },
	{ wasm: 57.3, native: 9.0, server: 600.7 },
	{ wasm: 58.6, native: 12.7, server: 177.3 },
	{ wasm: 73.4, native: 23.4, server: 2.3 },
	{ wasm: 36.8, native: 50.8, server: 113.3 },
	{ wasm: 16.4, native: 39.7, server: 216.3 },
	{ wasm: 37.2, native: 41.2, server: 105 },
	{ wasm: 57.2, native: 18.6, server: 59 },
	{ wasm: 46.1, native: 12.0, server: 87.4 },
	{ wasm: 30.7, native: 7.0, server: 182.1 },
	{ wasm: 18.7, native: 2.2, server: 112 },
	{ wasm: 31.0, native: 42.3, server: 136.9 },
	{ wasm: 87.0, native: 24.6, server: 12 },
	{ wasm: 89.4, native: 34.7, server: 177.3 },
	{ wasm: 40.6, native: 51.7, server: 177.3 },
	{ wasm: 73.4, native: 50.7, server: 97 },
	{ wasm: 91.3, native: 55.8, server: 174.3 },
	{ wasm: 43.6, native: 52.2, server: 169 },
	{ wasm: 3.5, native: 37.2, server: 66.3 },
	{ wasm: 3.8, native: 20.8, server: 99.7 },
	{ wasm: 20.0, native: 28.6, server: 305.6 },
	{ wasm: 27.3, native: 59.6, server: 188.3 },
	{ wasm: 87.8, native: 37.4, server: 160.8 },
	{ wasm: 87.0, native: 8.8, server: 250.2 },
	{ wasm: 31.0, native: 12.7, server: 10.7 },
	{ wasm: 73.8, native: 16.4, server: 115.3 },
	{ wasm: 21.1, native: 15.7, server: 28.9 },
	{ wasm: 20.5, native: 55.2, server: 125.7 },
	{ wasm: 11.5, native: 49.1, server: 212.3 },
];

const benchmarkConfig = {
	wasm: {
		label: "WASM",
		color: "#2563eb",
	},
	native: {
		label: "Actix",
		color: "#F25912",
	},
	server: {
		label: "Server",
		color: "#34d399",
	},
} satisfies ChartConfig;

export default function BenchmarkChart() {
	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="flex md:flex-row flex-col">
					<div className="flex-1">
						<CardTitle>Benchmark of WASM and Native</CardTitle>
						<CardDescription>
							This chart shows the time execution of each process with WASM and
							Native.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="overflow-x-scroll">
					<ChartContainer
						config={benchmarkConfig}
						className="max-h-[400px] w-[1200px]">
						<LineChart
							accessibilityLayer
							data={benchmarkCPUData}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="process"
								axisLine={false}
								tickLine={false}
								tickMargin={10}
								tickFormatter={(_, index) => `Test ${index + 1}`}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tickMargin={10}
								unit="%"
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										hideLabel
										className="w-[180px]"
										formatter={(value, name) => (
											<>
												<div
													className="h-4 w-1 rounded-[2px] bg-(--color-bg)"
													style={
														{
															"--color-bg": `var(--color-${name})`,
														} as React.CSSProperties
													}
												/>
												{benchmarkConfig[name as keyof typeof benchmarkConfig]
													?.label || name}
												<div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
													{value}
													<span className="text-muted-foreground font-normal">
														%
													</span>
												</div>
											</>
										)}
									/>
								}
							/>
							<ChartLegend content={<ChartLegendContent />} />
							<Line
								type="monotone"
								dataKey="wasm"
								stroke="var(--color-wasm)"
								fill="var(--color-wasm)"
								fillOpacity={0.3}
							/>
							<Line
								type="monotone"
								dataKey="native"
								stroke="var(--color-native)"
								fill="var(--color-native)"
								fillOpacity={0.3}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex md:flex-row flex-col">
					<div className="flex-1">
						<CardTitle>Benchmark of WASM and Native</CardTitle>
						<CardDescription>
							This chart shows the time execution of each process with WASM and
							Native.
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent className="overflow-x-scroll">
					<ChartContainer
						config={benchmarkConfig}
						className="max-h-[400px] w-[1200px]">
						<LineChart
							accessibilityLayer
							data={benchmarkCPUDataServer}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey="process"
								axisLine={false}
								tickLine={false}
								tickMargin={10}
								tickFormatter={(_, index) => `Test ${index + 1}`}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tickMargin={10}
								unit="%"
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										hideLabel
										className="w-[180px]"
										formatter={(value, name) => (
											<>
												<div
													className="h-4 w-1 rounded-[2px] bg-(--color-bg)"
													style={
														{
															"--color-bg": `var(--color-${name})`,
														} as React.CSSProperties
													}
												/>
												{benchmarkConfig[name as keyof typeof benchmarkConfig]
													?.label || name}
												<div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
													{value}
													<span className="text-muted-foreground font-normal">
														%
													</span>
												</div>
											</>
										)}
									/>
								}
							/>
							<ChartLegend content={<ChartLegendContent />} />
							<Line
								type="monotone"
								dataKey="server"
								stroke="var(--color-server)"
								fill="var(--color-server)"
								fillOpacity={0.3}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}