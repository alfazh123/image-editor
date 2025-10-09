import { transferColorWASM } from "@/app/hooks/wasm/func";
import { useImageEditor } from "../useImageEditor";
import { useBenchmarkHook } from "../useBenchmark";

export async function TranferColor(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	refSize: { width: number; height: number }
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

	addBenchmarkResult(
		benchmarkHook,
		time,
		{
			width: hook.imageSize.width,
			height: hook.imageSize.height,
		},
		refSize
	);
}

export async function TransferColorProvided(
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	providedImgArr: Uint8Array,
	refSize: { width: number; height: number }
) {
	const start = performance.now();
	const result = transferColorWASM(hook.originalImgArr, providedImgArr);
	hook.setEditedImgArr(await result);
	hook.setImgUrl(hook.ArrToURL(await result));
	hook.setIsLoading(false);
	console.timeEnd("Filter apply finish in");
	const end = performance.now();
	const time = end - start;

	addBenchmarkResult(
		benchmarkHook,
		time,
		{
			width: hook.imageSize.width,
			height: hook.imageSize.height,
		},
		refSize
	);
}

function addBenchmarkResult(
	benchmarkHook: ReturnType<typeof useBenchmarkHook>,
	time: number,
	imageSize: { width: number; height: number },
	refImageSize?: { width: number; height: number }
) {
	const date = new Date();

	if (benchmarkHook.startBenchmark) {
		benchmarkHook.setTransferColorAttemp((prev) => [
			...prev,
			{
				latency: benchmarkHook.resultSpeed?.latency ?? 0,
				downloadSpeed: benchmarkHook.resultSpeed?.downloadSpeed ?? 0,
				uploadSpeed: benchmarkHook.resultSpeed?.uploadSpeed ?? 0,
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
		benchmarkHook.setTestAttempts((prev) => ({
			...prev,
			colorTransfer: prev.colorTransfer + 1,
		}));

		console.log(benchmarkHook.transferColorAttemp);
	}
}
