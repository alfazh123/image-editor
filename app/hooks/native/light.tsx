import { handleContrastsNative, handleExposureNative } from "@/app/native/func";
import { useBenchmarkHook } from "../useBenchmark";
import { useImageEditor } from "../useImageEditor";

export async function ExposureNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) {
	console.time("Adjust Tint Native finish in");
	const start = performance.now();

	const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
		type: "image/png",
	});
	const result = await handleExposureNative(blob, hook.lightVal.exposureValue);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Tint Native finish in");
	const end = performance.now();
	const time = end - start;
	benchmarkHook.setBenchmarkNative((prev) => [
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

export async function ContrastNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) {
	console.time("Adjust Tint Native finish in");
	const start = performance.now();

	const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
		type: "image/png",
	});
	const result = await handleContrastsNative(blob, hook.lightVal.contrastValue);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Tint Native finish in");
	const end = performance.now();
	const time = end - start;
	benchmarkHook.setBenchmarkNative((prev) => [
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