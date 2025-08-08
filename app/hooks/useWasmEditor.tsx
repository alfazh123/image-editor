import { MenuFilter } from "../menu/type";
import {
	adjustContrasts,
	adjustExposure,
	adjustSaturation,
	adjustTemperature,
	adjustTint,
	grayscaleImage,
	sharpImageWASM,
	transferColorWASM,
} from "../wasm/func";
import { useImageEditor } from "./useImageEditor";
import { useBenchmarkHook } from "./useBenchmark";

export const useWasmHook = (
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) => {
	const transferColor = async () => {
		console.time("Transfer color WASM completed in");
		hook.setIsLoading(true);

		if (hook.editedImgArr.length > 0 && hook.refImgArr.length > 0) {
			const start = performance.now();
			console.log("Transfer Color with WASM");
			const result = transferColorWASM(hook.editedImgArr, hook.refImgArr);
			hook.setEditedImgArr(await result);
			// setEditImgArr(await result);
			hook.setImgUrl(hook.ArrToURL(await result));
			hook.setIsLoading(false);
			console.timeEnd("Transfer color WASM completed in");
			const end = performance.now();
			const time = end - start;

			benchmarkHook.setBenchmarkWASM((prev) => [
				...prev,
				{
					latency: benchmarkHook.resultSpeed?.latency ?? 0,
					method: "transferColor",
					time,
					width: hook.imageSize.width,
					height: hook.imageSize.height,
				},
			]);
			benchmarkHook.resultSpeed?.latency
				? benchmarkHook.setTestAttemptsLatency((prev) => ({
						...prev,
						colorTransfer: prev.colorTransfer + 1,
				  }))
				: benchmarkHook.setTestAttempts((prev) => ({
						...prev,
						colorTransfer: prev.colorTransfer + 1,
				  }));
		} else {
			hook.setIsLoading(false);
			alert("No image data available for transfer color");
		}
	};

	const grayscale = async () => {
		console.time("Grayscale finish in");
		hook.setIsLoading(true);
		if (hook.editedImgArr.length == 0) {
			hook.setIsLoading(false);
			alert("No image data available for grayscaling");
		}
		const result = grayscaleImage(hook.editedImgArr);
		hook.setEditedImgArr(await result);
		hook.setImgUrl(hook.ArrToURL(await result));
		hook.setIsLoading(false);
		console.timeEnd("Grayscale finish in");
	};

	const noFilter = () => {
		hook.setIsLoading(true);
		hook.setImgUrl(hook.ArrToURL(hook.originalImgArr));
		hook.setIsLoading(false);
	};

	const functionFilter = async (imageData: Uint8Array) => {
		console.time("Filter apply finish in");
		hook.setIsLoading(true);
		// Do not log isLoading here, as it won't reflect the updated value immediately
		if (hook.editedImgArr.length > 0 && imageData.length > 0) {
			const start = performance.now();
			const result = transferColorWASM(hook.originalImgArr, imageData);
			// setEditImgArr(await result);
			hook.setEditedImgArr(await result);
			hook.setImgUrl(hook.ArrToURL(await result));
			hook.setIsLoading(false);
			console.timeEnd("Filter apply finish in");
			const end = performance.now();
			const time = end - start;

			benchmarkHook.setBenchmarkWASM((prev) => [
				...prev,
				{
					latency: benchmarkHook.resultSpeed?.latency ?? 0,
					method: "transferColor",
					time,
					width: hook.imageSize.width,
					height: hook.imageSize.height,
				},
			]);
			benchmarkHook.resultSpeed?.latency
				? benchmarkHook.setTestAttemptsLatency((prev) => ({
						...prev,
						colorTransfer: prev.colorTransfer + 1,
				  }))
				: benchmarkHook.setTestAttempts((prev) => ({
						...prev,
						colorTransfer: prev.colorTransfer + 1,
				  }));
		} else {
			hook.setIsLoading(false);
			alert("No image data available for transfer color");
		}
	};

	const filterMenu: MenuFilter[] = [
		{
			name: "No Filter",
			onChangeFilter: noFilter,
			color: "bg-slate-200",
		},
		{
			name: "Grayscale",
			onChangeFilter: grayscale,
			color: "bg-gray-400",
		},
	];

	const sharp = async (value: number[]) => {
		const start = performance.now();
		console.time("Sharp image finish in");
		hook.setSharpVal(value[0]);
		const result = await sharpImageWASM(hook.originalImgArr, value[0]);
		hook.setEditedImgArr(result);
		// setEditImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Sharp image finish in");
		const end = performance.now();
		const time = end - start;

		benchmarkHook.setBenchmarkWASM((prev) => [
			...prev,
			{
				latency: benchmarkHook.resultSpeed?.latency ?? 0,
				method: "sharp",
				time,
				width: hook.imageSize.width,
				height: hook.imageSize.height,
			},
		]);
		benchmarkHook.resultSpeed?.latency
			? benchmarkHook.setTestAttemptsLatency((prev) => ({
					...prev,
					sharpness: prev.sharpness + 1,
			  }))
			: benchmarkHook.setTestAttempts((prev) => ({
					...prev,
					sharpness: prev.sharpness + 1,
			  }));
	};

	const saturation = async (value: number[]) => {
		const start = performance.now();
		console.time("Adjust Saturation finish in");
		hook.setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));
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
		benchmarkHook.resultSpeed?.latency
			? benchmarkHook.setTestAttemptsLatency((prev) => ({
					...prev,
					saturation: prev.saturation + 1,
			  }))
			: benchmarkHook.setTestAttempts((prev) => ({
					...prev,
					saturation: prev.saturation + 1,
			  }));
	};

	const temperature = async (value: number[]) => {
		const start = performance.now();
		console.time("Adjust Temperature finish in");
		hook.setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		const result = await adjustTemperature(hook.originalImgArr, value[0]);
		hook.setEditedImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Temperature finish in");
		const end = performance.now();
		const time = end - start;

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
		benchmarkHook.resultSpeed?.latency
			? benchmarkHook.setTestAttemptsLatency((prev) => ({
					...prev,
					temperature: prev.temperature + 1,
			  }))
			: benchmarkHook.setTestAttempts((prev) => ({
					...prev,
					temperature: prev.temperature + 1,
			  }));
	};

	const tint = async (value: number[]) => {
		const start = performance.now();
		console.time("Adjust Temperature finish in");
		hook.setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));
		const result = await adjustTint(hook.originalImgArr, value[0]);
		hook.setEditedImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Temperature finish in");
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
		benchmarkHook.resultSpeed?.latency
			? benchmarkHook.setTestAttemptsLatency((prev) => ({
					...prev,
					tint: prev.tint + 1,
			  }))
			: benchmarkHook.setTestAttempts((prev) => ({
					...prev,
					tint: prev.tint + 1,
			  }));
	};

	const exposure = async (value: number[]) => {
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
		benchmarkHook.resultSpeed?.latency
			? benchmarkHook.setTestAttemptsLatency((prev) => ({
					...prev,
					exposure: prev.exposure + 1,
			  }))
			: benchmarkHook.setTestAttempts((prev) => ({
					...prev,
					exposure: prev.exposure + 1,
			  }));
	};

	const contrast = async (value: number[]) => {
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
		benchmarkHook.resultSpeed?.latency
			? benchmarkHook.setTestAttemptsLatency((prev) => ({
					...prev,
					contrast: prev.contrast + 1,
			  }))
			: benchmarkHook.setTestAttempts((prev) => ({
					...prev,
					contrast: prev.contrast + 1,
			  }));
	};

	return {
		transferColor,
		functionFilter,
		filterMenu,
		sharp,
		saturation,
		temperature,
		tint,
		exposure,
		contrast,
	};
};