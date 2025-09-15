import { adjustContrasts, adjustExposure } from "@/app/wasm/func";
import { useBenchmarkHook } from "../useBenchmark";
import { useImageEditor } from "../useImageEditor";

export async function Exposure(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	value: number[]
) {
	const start = performance.now();
	console.time("Adjust Exposure finish in");
	hook.setLightVal((prev) => ({
		...prev,
		exposureValue: value[0],
	}));
	const result = await adjustExposure(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Exposure finish in");
	const end = performance.now();
	const time = end - start;

	benchmarkHook.setBenchmarkWASM((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			method: "exposure",
			time,
			width: hook.imageSize.width,
			height: hook.imageSize.height,
		},
	]);
	if (benchmarkHook.resultSpeed?.latency) {
		benchmarkHook.setTestAttemptsLatency((prev) => ({
			...prev,
			exposure: prev.exposure + 1,
		}));
	} else {
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			exposure: prev.exposure + 1,
		}));
	}
}

export async function Contrast(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	value: number[]
) {
	const start = performance.now();
	console.time("Adjust Exposure finish in");
	hook.setLightVal((prev) => ({
		...prev,
		contrastValue: value[0],
	}));
	const result = await adjustContrasts(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Exposure finish in");
	const end = performance.now();
	const time = end - start;

	benchmarkHook.setBenchmarkWASM((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			method: "contrast",
			time,
			width: hook.imageSize.width,
			height: hook.imageSize.height,
		},
	]);
	if (benchmarkHook.resultSpeed?.latency) {
		benchmarkHook.setTestAttemptsLatency((prev) => ({
			...prev,
			contrast: prev.contrast + 1,
		}));
	} else {
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			contrast: prev.contrast + 1,
		}));
	}
}