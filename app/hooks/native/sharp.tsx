import { handleSharpNative } from "@/app/hooks/native/func";
import { useBenchmarkHook } from "../useBenchmark";
import { useImageEditor } from "../useImageEditor";

export async function SharpNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	value: number[]
) {
	console.time("Adjust Sharp Native finish in");
	const start = performance.now();
	const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
		type: "image/png",
	});
	const result = await handleSharpNative(blob, value[0]);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Sharp Native finish in");
	const end = performance.now();
	const time = end - start;
	const date = new Date();
	benchmarkHook.setBenchmarkNative((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			method: "sharp",
			time,
			width: hook.imageSize.width,
			height: hook.imageSize.height,
			date: date.toLocaleTimeString(),
		},
	]);

	if (benchmarkHook.resultSpeed?.latency) {
		benchmarkHook.setTestAttemptsLatency((prev) => ({
			...prev,
			sharpness: prev.sharpness + 1,
		}));
	} else {
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			sharpness: prev.sharpness + 1,
		}));
	}
}
