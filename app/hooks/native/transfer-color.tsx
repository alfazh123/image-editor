import { swithColorNative } from "@/app/hooks/native/func";
import { useBenchmarkHook } from "../useBenchmark";
import { useImageEditor } from "../useImageEditor";

export async function TransferColorNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) {
	console.time("Transfer color native completed in");
	const start = performance.now();
	hook.setIsLoading(true);
	const resultArr = await swithColorNative(
		new Blob([new Uint8Array(hook.originalImgArr)], { type: "image/png" }),
		new Blob([new Uint8Array(hook.refImgArr)], { type: "image/png" })
	);
	hook.setImgUrl(hook.ArrToURL(resultArr));
	hook.setIsLoading(false);
	// setEditImgArr(resultArr); // Store original image data
	hook.setOriginalImgArr(resultArr); // Store original image data
	console.timeEnd("Transfer color native completed in");
	const end = performance.now();
	const time = end - start;
	const imageSize = {
		width: hook.imageSize.width,
		height: hook.imageSize.height,
	};
	const refImageSize = {
		width: hook.refSize.width,
		height: hook.refSize.height,
	};
	addBenchmarkResult(benchmarkHook, time, imageSize, refImageSize);
}

export async function TransferColorProvidedNative(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	providedImgArr: Uint8Array
) {
	hook.setIsLoading(true);
	const start = performance.now();
	if (hook.originalImgArr.length > 0 && providedImgArr.length > 0) {
		const result = await swithColorNative(
			new Blob([new Uint8Array(hook.originalImgArr)], { type: "image/png" }),
			new Blob([new Uint8Array(providedImgArr)], { type: "image/png" })
		);
		hook.setEditedImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		hook.setIsLoading(false);
	}
	const end = performance.now();
	const time = end - start;
	const imageSize = {
		width: hook.imageSize.width,
		height: hook.imageSize.height,
	};
	const refImageSize = {
		width: hook.refSize.width,
		height: hook.refSize.height,
	};
	addBenchmarkResult(benchmarkHook, time, imageSize, refImageSize);
}

function addBenchmarkResult(
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	time: number,
	imageSize: { width: number; height: number },
	refImageSize: { width: number; height: number }
) {
	const date = new Date();
	benchmarkHook.setTransferColorAttemp((prev) => [
		...prev,
		{
			latency: benchmarkHook.resultSpeed?.latency ?? 0,
			time,
			width: imageSize.width,
			height: imageSize.height,
			internetAvailable: false,
			targetSize: imageSize,
			referenceSize: refImageSize || { width: 0, height: 0 },
			timeTaken: time,
			type: "WASM",
			date: date.toLocaleTimeString(),
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
