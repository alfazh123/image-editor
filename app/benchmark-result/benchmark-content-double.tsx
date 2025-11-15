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
import { getBenchmarkDataMerge } from "./func";
import { BenchmarkResultProps, TransferColorAttempt } from "../menu/type";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";

export default function BenchmarkContentDouble() {
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

    if (sizeWasm.width !== sizeNative.width || sizeWasm.height !== sizeNative.height) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="mx-auto max-w-4xl p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg border border-blue-200">
                    <h1 className="text-4xl font-extrabold mb-4 text-blue-800 tracking-tight drop-shadow">
                        Benchmark Data Size Mismatch
                    </h1>
                    <p className="text-gray-700 mb-2 text-lg">
                        The benchmark data sizes for WASM and Native do not match. Please ensure that both benchmarks are run with the same image size.
                    </p>
                    <Link
                        href="/wasm"
                        className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors">
                        Go to WASM Editor
                    </Link>
                    <Link
                        href="/native"
                        className="inline-block mt-4 ml-4 px-6 py-3 bg-orange-400 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors">
                        Go to Native Editor
                    </Link>
                </div>
            </div>
        );
    }

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
        const { mergeData } = getBenchmarkDataMerge(
            parsedDataWasm,
            parsedDataNative,
            colTransferData
        )

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
            <div className="max-w-6xl mx-auto">
                <Navbar />
                <div className="p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg border border-blue-200">
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
                            {mergeData &&
                                mergeData.map((benchmark, id) => (
                                    <Card
                                        key={id}
                                        className="border border-blue-200 shadow-md bg-white/80 hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="text-2xl font-bold text-blue-700">
                                                Benchmark {benchmark.name}
                                            </CardTitle>
                                            <CardDescription className="text-gray-500">
                                                This process had an average execution time of{" "}
                                                <div className="flex justify-between">
                                                    {benchmark.data[0].internetNative?.downloadSpeed !== 0 ? 
                                                        ((benchmark.data[0].internetWasm &&
                                                            benchmark.data[0].internetWasm.latency !== undefined) ||
                                                            benchmark.data[0].internetWasm.latency > 0) && (
                                                            <div className="flex flex-col gap-2">
                                                                <p>Internet Speed WASM</p>
                                                                <span>
                                                                    Latency:
                                                                    <span className="font-semibold text-blue-700">
                                                                        {benchmark.data[0].internetWasm.latency.toFixed(2)} ms
                                                                    </span>
                                                                </span>
                                                                <span>
                                                                    Download:
                                                                    <span className="font-semibold text-blue-700">
                                                                        {benchmark.data[0].internetWasm.downloadSpeed.toFixed(2)}{" "}
                                                                        MB
                                                                    </span>
                                                                </span>
                                                                <span>
                                                                    Upload:
                                                                    <span className="font-semibold text-blue-700">
                                                                        {benchmark.data[0].internetWasm.uploadSpeed.toFixed(2)} MB
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        ) : null
                                                    } 
                                                    {benchmark.data[0].internetNative?.downloadSpeed !== 0 ? 
                                                        ((benchmark.data[0].internetNative &&
                                                            benchmark.data[0].internetNative?.downloadSpeed !== 0) ||
                                                            benchmark.data[0].internetNative?.latency !== null ||
                                                            benchmark.data[0].internetNative?.downloadSpeed !== undefined) && (
                                                                
                                                            <div className="flex flex-col gap-2 text-right">
                                                                <p>Internet Speed Native</p>
                                                                <span>
                                                                    Latency:
                                                                    <span className="font-semibold text-blue-700">
                                                                        {benchmark.data[0].internetNative?.latency.toFixed(2)} ms
                                                                    </span>
                                                                </span>
                                                                <span>
                                                                    Download:
                                                                    <span className="font-semibold text-blue-700">
                                                                        {benchmark.data[0].internetNative?.downloadSpeed.toFixed(2)}{" "}
                                                                        MB
                                                                    </span>
                                                                </span>
                                                                <span>
                                                                    Upload:
                                                                    <span className="font-semibold text-blue-700">
                                                                        {benchmark.data[0].internetNative?.uploadSpeed.toFixed(2)} MB
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        ) : null
                                                    }
                                                </div>
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
                                                        dataKey="wasmTime"
                                                        fill={`var(--color-wasm)`}
                                                        radius={6}>
                                                        <LabelList
                                                            position="top"
                                                            offset={12}
                                                            className="fill-foreground"
                                                            fontSize={12}
                                                        />
                                                    </Bar>
                                                    <Bar
                                                        dataKey="nativeTime"
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

                        {/* <div className="mt-8 bg-white rounded-lg shadow border border-blue-100 p-4">
                            <LogTable columns={columns} data={parsedDataWasm} />
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}
