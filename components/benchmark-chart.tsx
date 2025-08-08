'use client';

import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";

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

const benchmarkConfig = {
	wasm: {
		label: "WASM",
		color: "#2563eb",
	},
	native: {
		label: "Actix",
		color: "#60a5fa",
	},
} satisfies ChartConfig;

export default function BenchmarkChart() {
	const [benchmarkType, setBenchmarkType] = useState("time-execute");

	const filterData = benchmarkData.filter((data) => {
		return data.benchmarkType === benchmarkType;
	});

	return (
		<Card>
			<CardHeader className="flex md:flex-row flex-col">
				<div className="flex-1">
					<CardTitle>Benchmark of WASM and Native</CardTitle>
					<CardDescription>
						This chart shows the time execution{" "}
						{benchmarkType.includes("internet") ? "and internet speed" : ""} of
						each process with WASM and Native.
					</CardDescription>
				</div>
				<Select value={benchmarkType} onValueChange={setBenchmarkType}>
					<SelectTrigger>
						<SelectValue placeholder="Benchmark" />
					</SelectTrigger>
					<SelectContent className="text-wrap">
						<SelectItem value="time-execute">Time Execute</SelectItem>
						<SelectItem value="time-execute-internet">
							Time with Internet Speed
						</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={benchmarkConfig}
					className="min-h-[200px] w-full">
					<BarChart
						accessibilityLayer
						data={filterData}
						outerRadius={10}
						innerRadius={10}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="process"
							axisLine={false}
							tickLine={false}
							tickMargin={10}
							tickFormatter={(value) => value.slice(0.3)}
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
													ms
												</span>
											</div>
										</>
									)}
								/>
							}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Bar dataKey="wasm" fill="var(--color-wasm)" radius={4}>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
						<Bar dataKey="native" fill="var(--color-native)" radius={4}>
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
			<CardFooter className="flex flex-col items-start gap-2">
				<CardTitle>Conclusion</CardTitle>
				<CardDescription>
					From the chart above, we can see that the native implementation is
					faster than the WASM implementation in terms of time execution for
					each process. This is because the native implementation is written in
					Rust and compiled to machine code, while the WASM implementation is
					compiled to WebAssembly and runs in a virtual machine.
					<br />
					<br />
					The WASM implementation is slower because it has to go through an
					additional layer of abstraction, which adds overhead to the execution
					time. However, the WASM implementation is more portable and can run in
					any browser that supports WebAssembly, while the native implementation
					can only run on the server.
					<br />
					<br />
					In conclusion, the native implementation is faster than the WASM
					implementation in terms of time execution for each process, but the
					WASM implementation is more portable and can run in any browser that
					supports WebAssembly.
				</CardDescription>
			</CardFooter>
		</Card>
	);
}