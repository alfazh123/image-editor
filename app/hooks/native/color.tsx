import { handleSaturationNative, handleTemperatureNative, handleTintNative } from "@/app/native/func";
import { useBenchmarkHook } from "../useBenchmark";
import { useImageEditor } from "../useImageEditor";

export async function SaturationNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) {
	console.time("Adjust Saturation Native finish in");
	const start = performance.now();

	const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
		type: "image/png",
	});
	const result = await handleSaturationNative(
		blob,
		hook.colorVal.saturationValue
	);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Saturation Native finish in");
	const end = performance.now();
	const time = end - start;
	benchmarkHook.setBenchmarkNative((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			method: "saturation",
			time,
			width: hook.imageSize.width,
			height: hook.imageSize.height,
		},
	]);
	if (benchmarkHook.resultSpeed?.latency) {
		benchmarkHook.setTestAttemptsLatency((prev) => ({
			...prev,
			saturation: prev.saturation + 1,
		}));
	} else {
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			saturation: prev.saturation + 1,
		}));
	}
}

export async function TemperatureNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	value: number[]
) {
	console.time("Adjust Temperature Native finish in");
	const start = performance.now();
	console.log("Temperature value:", value[0]);
	const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
		type: "image/png",
	});
	const result = await handleTemperatureNative(
		blob,
		hook.colorVal.temperatureValue
	);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Temperature Native finish in");
	const end = performance.now();
	const time = end - start;
	benchmarkHook.setBenchmarkNative((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			method: "temperature",
			time,
			width: hook.imageSize.width,
			height: hook.imageSize.height,
		},
	]);
	if (benchmarkHook.resultSpeed?.latency) {
		benchmarkHook.setTestAttemptsLatency((prev) => ({
			...prev,
			temperature: prev.temperature + 1,
		}));
	} else {
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			temperature: prev.temperature + 1,
		}));
	}
}

export async function TintNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) {
	console.time("Adjust Tint Native finish in");
	const start = performance.now();

	const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
		type: "image/png",
	});
	const result = await handleTintNative(blob, hook.colorVal.tintValue);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Tint Native finish in");
	const end = performance.now();
	const time = end - start;
	benchmarkHook.setBenchmarkNative((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			method: "tint",
			time,
			width: hook.imageSize.width,
			height: hook.imageSize.height,
		},
	]);
	if (benchmarkHook.resultSpeed?.latency) {
		benchmarkHook.setTestAttemptsLatency((prev) => ({
			...prev,
			tint: prev.tint + 1,
		}));
	} else {
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			tint: prev.tint + 1,
		}));
	}
}