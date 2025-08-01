'use client';

import SpeedTest from '@cloudflare/speedtest';
import { useState } from 'react';
import { SpeedTestResult } from '../menu/type';

export const useSpeedTestHook = () => {
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
                    downloadSpeed: (result.getSummary().download * 10**-6).toFixed(2),
                    uploadSpeed: (result.getSummary().upload * 10**-6).toFixed(2),
                    latency: (result.getSummary().latency).toFixed(2),
                });
                setIsFinished(true);
                setIsLoading(false);
                setError(null);
			};
			speedTest.play();
        } catch (error) {
            console.error("Speed Test failed:", error);
            setIsLoading(false);
            setIsFinished(true);
            setError(error instanceof Error ? error.message : "An unknown error occurred");
            throw error;
        }
    };

    return { runSpeedTest, isFinished, error, isLoading, resultSpeed };
}