'use client';

import SpeedTest, { Results } from "@cloudflare/speedtest";
import { useState } from "react";
import {
	BenchmarkResultProps,
	SpeedTestResult,
	TransferColorAttempt,
} from "../menu/type";
import { toast } from "sonner";

export const useBenchmarkHook = () => {
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

			speedTest.onFinish = (result: Results) => {
				clearTimeout(testTimeout);
				console.log("Speed Test Results:", result);
				const summary = result.getSummary();
				console.log(summary);
				setResultSpeed({
					downloadSpeed: (summary.download ?? 0) * 10 ** -6,
					uploadSpeed: (summary.upload ?? 0) * 10 ** -6,
					latency: summary.latency ?? 0,
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

	const [transferColorAttemp, setTransferColorAttemp] = useState<
		TransferColorAttempt[]
	>([]);

	const [benchmarkWASM, setBenchmarkWASM] = useState<BenchmarkResultProps[]>(
		[]
	);

	const [benchmarkNative, setBenchmarkNative] = useState<
		BenchmarkResultProps[]
	>([]);

	const [startBenchmark, setStartBenchmark] = useState(false);
	const [useLatency, setUseLatency] = useState(false);
	const changeUseLatency = () => {
		setUseLatency(!useLatency);
		console.log("Use Latency:", !useLatency);
	};

	return {
		runSpeedTest,
		isFinished,
		error,
		isLoading,
		resultSpeed,
		setResultSpeed,
		benchmarkWASM,
		setBenchmarkWASM,
		benchmarkNative,
		setBenchmarkNative,
		testAttempts,
		setTestAttempts,
		transferColorAttemp,
		setTransferColorAttemp,
		startBenchmark,
		setStartBenchmark,
		useLatency,
		setUseLatency,
		changeUseLatency,
	};
};