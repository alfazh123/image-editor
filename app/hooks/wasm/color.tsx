import { adjustSaturation, adjustTemperature, adjustTint } from "@/app/wasm/func";
import { useBenchmarkHook } from "../useBenchmark";
import { useImageEditor } from "../useImageEditor";

export async function Saturation(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	value: number[]
) {
	const start = performance.now();
	console.time("Adjust Saturation finish in");
	const result = await adjustSaturation(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Saturation finish in");
	const end = performance.now();
	const time = end - start;

	benchmarkHook.setBenchmarkWASM((prev) => [
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

export async function Temperature(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	value: number[]
) {
	const start = performance.now();
	console.time("Adjust Temperature finish in");
	const result = await adjustTemperature(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Temperature finish in");
	const end = performance.now();
	const time = end - start;
	console.log("Temperature : ", time);

	benchmarkHook.setBenchmarkWASM((prev) => [
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

export async function Tint(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	value: number[]
) {
	const start = performance.now();
	console.time("Adjust Tint finish in");
	const result = await adjustTint(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Tint finish in");
	const end = performance.now();
	const time = end - start;

	benchmarkHook.setBenchmarkWASM((prev) => [
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