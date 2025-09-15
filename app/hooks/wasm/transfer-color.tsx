import { transferColorWASM } from "@/app/wasm/func";
import { useImageEditor } from "../useImageEditor";
import { useBenchmarkHook } from "../useBenchmark";

export async function TranferColor(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) {
	console.time("Transfer color WASM completed in");
	const start = performance.now();
	const result = await transferColorWASM(hook.originalImgArr, hook.refImgArr);
	hook.setEditedImgArr(result);
	// setEditImgArr(await result);
	hook.setImgUrl(hook.ArrToURL(result));
	hook.setIsLoading(false);
	console.timeEnd("Transfer color WASM completed in");
	const end = performance.now();
	const time = end - start;

	addBenchmarkResult(benchmarkHook, time, {
		width: hook.imageSize.width,
		height: hook.imageSize.height,
	});
}

export async function TransferColorProvided(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	providedImgArr: Uint8Array
) {
	const start = performance.now();
	const result = transferColorWASM(hook.originalImgArr, providedImgArr);
	hook.setEditedImgArr(await result);
	hook.setImgUrl(hook.ArrToURL(await result));
	hook.setIsLoading(false);
	console.timeEnd("Filter apply finish in");
	const end = performance.now();
	const time = end - start;

	addBenchmarkResult(benchmarkHook, time, {
		width: hook.imageSize.width,
		height: hook.imageSize.height,
	});
}

function addBenchmarkResult(
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	time: number,
	imageSize: { width: number; height: number }
) {
	benchmarkHook.setBenchmarkWASM((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			method: "transferColor",
			time,
			width: imageSize.width,
			height: imageSize.height,
		},
	]);
	if (benchmarkHook.resultSpeed?.latency) {
		benchmarkHook.setTestAttemptsLatency((prev) => ({
			...prev,
			colorTransfer: prev.colorTransfer + 1,
		}));
	} else {
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			colorTransfer: prev.colorTransfer + 1,
		}));
	}
}