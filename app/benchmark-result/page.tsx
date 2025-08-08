'use client';

import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
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

import { useSearchParams } from "next/navigation";
import { BenchmarkResultProps } from "../menu/type";

function filterData(data: BenchmarkResultProps[], method: string, more = false) {
    return data.filter((item) => item.method === method && (more ? item.latency > 0 : item.latency === 0)).map((item) => ({
        ...item,
        time: (item.time / 1000).toFixed(2), // Convert to seconds
    }));
}

export default function BenchmarkResult() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    const data = type === 'wasm' ? localStorage.getItem('benchmarkWASM') : localStorage.getItem('benchmarkNative')

    const parsedData = data ? JSON.parse(data) : [];

    const ct = filterData(parsedData, 'transferColor');
    const sharp = filterData(parsedData, 'sharp');
    const saturation = filterData(parsedData, 'saturation');
    const temperature = filterData(parsedData, 'temperature');
    const tint = filterData(parsedData, 'tint');
    const constrast = filterData(parsedData, 'contrast');
    const exposure = filterData(parsedData, 'exposure');
    
    const ctL = filterData(parsedData, 'transferColor', true);
    const sharpL = filterData(parsedData, 'sharp', true);
    const saturationL = filterData(parsedData, 'saturation', true);
    const temperatureL = filterData(parsedData, 'temperature', true);
    const tintL = filterData(parsedData, 'tint', true);
    const constrastL = filterData(parsedData, 'contrast', true);
    const exposureL = filterData(parsedData, 'exposure', true);

    const benchmarkData = [
        {
            name: "Color Transfer",
            data: ct,
        },
        {
            name: "Sharpness",
            data: sharp,
        },
        {
            name: "Saturation",
            data: saturation,
        },
        {
            name: "Temperature",
            data: temperature,
        },
        {
            name: "Tint",
            data: tint,
        },
        {
            name: "contrasts",
            data: constrast,
        },
        {
            name: "Exposure",
            data: exposure,
        },
    ]

    const benchmarkDataLatency = [
        {
            name: "Color Transfer",
            data: ctL,
        },
        {
            name: "Sharpness",
            data: sharpL,
        },
        {
            name: "Saturation",
            data: saturationL,
        },
        {
            name: "Temperature",
            data: temperatureL,
        },
        {
            name: "Tint",
            data: tintL,
        },
        {
            name: "Contrasts",
            data: constrastL,
        },
        {
            name: "Exposure",
            data: exposureL,
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

    return (
        <div className="mx-auto max-w-4xl p-4">
            <h1>Benchmark Results</h1>
            <p>This page display the results of benchmark test for various image processing methods. Benchmark divides into two type, benchmarks using time execution and benchmarks time execution compare to latency.</p>
            <br/>
            <br/>
            <p>You can save this page as complete webpage to keep the result with command <strong>CTRL + S</strong>.</p>
            <div className="flex flex-col gap-4">
                {benchmarkData && benchmarkData.map((benchmark, id) => (
                    <Card key={id} className="">
                        <CardHeader>
                        <CardTitle>Benchmark {benchmark.name}</CardTitle>
                        <CardDescription>
                            This chart shows the time execution of various image processing methods.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={benchmarkConfig}
                            className="h-full w-full">
                            <BarChart
                                // accessibilityLayer
                                data={benchmark.data}
                                // outerRadius={10}
                                // innerRadius={10}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                <CartesianGrid vertical={false} />
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                                {/* <ChartLegend content={<ChartLegendContent />} /> */}
                                <Bar dataKey="time" fill={`var(--color-${type})`} radius={4}>
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
            <div className="flex flex-col gap-4">
                {benchmarkDataLatency && benchmarkDataLatency.map((benchmark, id) => (
                    <Card key={id} className="">
                        <CardHeader>
                        <CardTitle>Benchmark {benchmark.name}</CardTitle>
                        <CardDescription>
                            This chart shows the time execution of various image processing methods.
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
                                <ChartTooltip content={<ChartTooltipContent/>}/>
                                {/* <ChartLegend content={<ChartLegendContent />} /> */}
                                <Bar dataKey="time" fill={`var(--color-${type})`} radius={4}>
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
        </div>
    )
}