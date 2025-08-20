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
import { useRef } from "react";
import { Saturation, Temperature, Tint } from "./wasm/color";
import { TranferColor, TransferColorProvided } from "./wasm/transfer-color";
import { Sharp } from "./wasm/sharp";
import { Contrast, Exposure } from "./wasm/light";

export const useWasmHook = (
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const transferColor = async () => {
		hook.setIsLoading(true);

		if (hook.editedImgArr.length > 0 && hook.refImgArr.length > 0) {
			TranferColor(hook, benchmarkHook);
		} else {
			hook.setIsLoading(false);
			alert("No image data available for transfer color");
		}
	};

	const sharp = async (value: number[]) => {
		hook.setSharpVal(value[0]);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			Sharp(hook, benchmarkHook, value);
		}, 300);
	};

	const saturation = async (value: number[]) => {
		hook.setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			Saturation(hook, benchmarkHook, value);
		}, 300);
	};

	const temperature = async (value: number[]) => {
		hook.setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			Temperature(hook, benchmarkHook, value);
		}, 300);
	};

	const tint = async (value: number[]) => {
		hook.setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			Tint(hook, benchmarkHook, value);
		}, 300);
	};

	const exposure = async (value: number[]) => {
		const start = performance.now();
		console.time("Adjust Exposure finish in");
		hook.setLightVal((prev) => ({
			...prev,
			exposureValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			Exposure(hook, benchmarkHook, value);
		}, 300);
	};

	const contrast = async (value: number[]) => {
		const start = performance.now();
		console.time("Adjust Exposure finish in");
		hook.setLightVal((prev) => ({
			...prev,
			contrastValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			Contrast(hook, benchmarkHook, value);
		}, 300);
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
			// const start = performance.now();
			// const result = transferColorWASM(hook.originalImgArr, imageData);
			// // setEditImgArr(await result);
			// hook.setEditedImgArr(await result);
			// hook.setImgUrl(hook.ArrToURL(await result));
			// hook.setIsLoading(false);
			// console.timeEnd("Filter apply finish in");
			// const end = performance.now();
			// const time = end - start;

			// benchmarkHook.setBenchmarkWASM((prev) => [
			// 	...prev,
			// 	{
			// 		latency: benchmarkHook.resultSpeed?.latency ?? 0,
			// 		method: "transferColor",
			// 		time,
			// 		width: hook.imageSize.width,
			// 		height: hook.imageSize.height,
			// 	},
			// ]);
			// benchmarkHook.resultSpeed?.latency
			// 	? benchmarkHook.setTestAttemptsLatency((prev) => ({
			// 			...prev,
			// 			colorTransfer: prev.colorTransfer + 1,
			// 	  }))
			// 	: benchmarkHook.setTestAttempts((prev) => ({
			// 			...prev,
			// 			colorTransfer: prev.colorTransfer + 1,
			// 	  }));
			TransferColorProvided(hook, benchmarkHook, imageData);
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