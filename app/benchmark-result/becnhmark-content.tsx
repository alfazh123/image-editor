'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

export default function BenchmarkContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get("type");

    const data =
        type === "wasm"
            ? localStorage.getItem("benchmarkWASM")
            : localStorage.getItem("benchmarkNative");

    const parsedData = data ? JSON.parse(data) : [];

    const { benchmarkData, benchmarkDataLatency } = getBenchmarkData(parsedData);

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

    return (
            <div className="mx-auto max-w-4xl p-4">
                <h1>Benchmark Results</h1>
                <p>
                    This page display the results of benchmark test for various image
                    processing methods. Benchmark divides into two type, benchmarks using
                    time execution and benchmarks time execution compare to latency.
                </p>
                <br />
                <br />
                <p>
                    You can save this page as complete webpage to keep the result with
                    command <strong>CTRL + S</strong>.
                </p>
                <div className="flex flex-col gap-4">
                    {benchmarkData &&
                        benchmarkData.map((benchmark, id) => (
                            <Card key={id} className="">
                                <CardHeader>
                                    <CardTitle>Benchmark {benchmark.name}</CardTitle>
                                    <CardDescription>
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
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid vertical={false} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            {/* <ChartLegend content={<ChartLegendContent />} /> */}
                                            <XAxis
                                                dataKey="time"
                                                axisLine={false}
                                                tickLine={false}
                                                tickMargin={10}
                                                tickFormatter={(value) => value.slice(0.3)}
                                            />
                                            <Bar
                                                dataKey="time"
                                                fill={`var(--color-${type})`}
                                                radius={4}>
                                                {/* <LabelList
                                                position="top"
                                                offset={12}
                                                className="fill-foreground"
                                                fontSize={12}
                                            /> */}
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        ))}
                </div>
                <div className="flex flex-col gap-4">
                    {benchmarkDataLatency &&
                        benchmarkDataLatency.map((benchmark, id) => (
                            <Card key={id} className="">
                                <CardHeader>
                                    <CardTitle>Benchmark {benchmark.name}</CardTitle>
                                    <CardDescription>
                                        This chart shows the time execution of various image
                                        processing methods.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={benchmarkConfig}
                                        className="min-h-[200px] w-full">
                                        <BarChart
                                            accessibilityLayer
                                            data={benchmark.data}
                                            outerRadius={10}
                                            innerRadius={10}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid vertical={false} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            {/* <ChartLegend content={<ChartLegendContent />} /> */}
                                            <XAxis
                                                dataKey="time"
                                                axisLine={false}
                                                tickLine={false}
                                                tickMargin={10}
                                                tickFormatter={(value) => value.slice(0.3)}
                                            />
                                            <Bar
                                                dataKey="time"
                                                fill={`var(--color-${type})`}
                                                radius={4}>
                                                {/* <LabelList
                                                position="top"
                                                offset={12}
                                                className="fill-foreground"
                                                fontSize={12}
                                            /> */}
                                            </Bar>
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            </div>
    );
}