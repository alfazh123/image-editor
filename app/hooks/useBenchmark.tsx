'use client';

import SpeedTest from '@cloudflare/speedtest';
import { useState } from 'react';
import { useImageEditor } from "./useImageEditor";
import { BenchmarkResultProps, SpeedTestResult } from '../menu/type';
import { toast } from 'sonner';

export const useBenchmarkHook = (hook: ReturnType<typeof useImageEditor>) => {
	const [isFinished, setIsFinished] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [resultSpeed, setResultSpeed] = useState<SpeedTestResult>();

	const runSpeedTest = async () => {
		console.log("Running speed test...");
		setIsLoading(true);
		try {
			const speedTest = new SpeedTest({
				autoStart: true,
			});

			// Set up a timeout to prevent hanging
			const testTimeout = setTimeout(() => {
				console.warn("Speed test taking too long, timing out...");
				setError(
					"Speed test timed out. This might be due to network restrictions, firewall settings, or corporate proxy."
				);
				// setIsRunning(false);
			}, 30000); // 30 seconds

			speedTest.onFinish = (result: any) => {
				clearTimeout(testTimeout);
				console.log("Speed Test Results:", result);
				console.log(result.getSummary());
				console.log(result.getSummary());
				setResultSpeed({
					downloadSpeed: result.getSummary().download * 10 ** -6,
					uploadSpeed: result.getSummary().upload * 10 ** -6,
					latency: result.getSummary().latency,
				});
				setIsFinished(true);
				setIsLoading(false);
				setError(null);
				toast.success("Start edit your image");
			};
			speedTest.play();
		} catch (error) {
			console.error("Speed Test failed:", error);
			setIsLoading(false);
			setIsFinished(true);
			setError(
				error instanceof Error ? error.message : "An unknown error occurred"
			);
			throw error;
		}
	};

	const [testAttempts, setTestAttempts] = useState({
			colorTransfer: 0,
			sharpness: 0,
			saturation: 0,
			temperature: 0,
			tint: 0,
			exposure: 0,
			contrast: 0,
		});

	const [testAttemptsLatency, setTestAttemptsLatency] = useState({
			colorTransfer: 0,
			sharpness: 0,
			saturation: 0,
			temperature: 0,
			tint: 0,
			exposure: 0,
			contrast: 0,
		});

	const [benchmarkWASM, setBenchmarkWASM] = useState<BenchmarkResultProps[]>(
		[]
	);

	const [benchmarkNative, setBenchmarkNative] = useState<
		BenchmarkResultProps[]
	>([]);

	const stopBenchmark = (benchmark: BenchmarkResultProps[]) => {
		console.log("Benchmark stopped:", benchmark);
		setBenchmarkWASM(benchmark);
		setBenchmarkNative(benchmark);
		setIsFinished(false);
		setError(null);
		setIsLoading(false);
		setTestAttempts({
			colorTransfer: 0,
			sharpness: 0,
			saturation: 0,
			temperature: 0,
			tint: 0,
			exposure: 0,
			contrast: 0,
		});
		setTestAttemptsLatency({
			colorTransfer: 0,
			sharpness: 0,
			saturation: 0,
			temperature: 0,
			tint: 0,
			exposure: 0,
			contrast: 0,
		});
		toast.info("Benchmark stopped successfully")
	}

	return { runSpeedTest, isFinished, error, isLoading, resultSpeed, setResultSpeed, benchmarkWASM, setBenchmarkWASM, benchmarkNative, setBenchmarkNative, testAttempts, setTestAttempts, stopBenchmark, testAttemptsLatency, setTestAttemptsLatency };
};