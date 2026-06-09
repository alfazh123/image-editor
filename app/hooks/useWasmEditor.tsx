"use client";

import { MenuFilter } from "../menu/type";
import { grayscaleImage } from "./wasm/func";
import { useImageEditor } from "./useImageEditor";
import { useEffect, useRef, useState } from "react";
import { TranferColor, TransferColorProvided } from "./wasm/transfer-color";
import { useColorProcessing } from "./useColorProcess";
import { useLightProcessing } from "./useLightProcess";
import { useSharpPRocess } from "./useSharpProcess";
import init from "rust-editor";

export const useWasmHook = (
	hook: ReturnType<typeof useImageEditor>,
	sharpen: ReturnType<typeof useSharpPRocess>,
	light: ReturnType<typeof useLightProcessing>,
	color: ReturnType<typeof useColorProcessing>,
) => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const transferColor = async () => {
		hook.setIsLoading(true);

		TranferColor(hook);
		hook.setIsLoading(false);
	};

	const sharp = async (value: number[]) => {
		sharpen.setSharpVal(value[0]);
		console.log("Sharp value set to:", value[0]);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			sharpen.Sharp(hook, value);
		}, 300);
	};

	const saturation = async (value: number[]) => {
		color.setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			color.Saturation(hook, value);
		}, 300);
	};

	const temperature = async (value: number[]) => {
		color.setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			color.Temperature(hook, value);
		}, 300);
	};

	const tint = async (value: number[]) => {
		color.setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			color.Tint(hook, value);
		}, 300);
	};

	const exposure = async (value: number[]) => {
		light.setLightVal((prev) => ({
			...prev,
			exposureValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			light.Exposure(hook, value);
		}, 300);
	};

	const contrast = async (value: number[]) => {
		console.time("Adjust Exposure finish in");
		light.setLightVal((prev) => ({
			...prev,
			contrastValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			light.Contrast(hook, value);
		}, 300);
	};

	const grayscale = async () => {
		console.time("Grayscale finish in");
		hook.setIsLoading(true);
		// if (hook.editedImgArr.length == 0) {
		// 	hook.setIsLoading(false);
		// 	alert("No image data available for grayscaling");
		// }
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
		TransferColorProvided(hook, imageData);
		hook.setIsLoading(false);
		// if (hook.editedImgArr.length > 0 && imageData.length > 0) {
		// } else {
		// 	alert("No image data available for transfer color");
		// }
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

export function useInitWasm() {
	const [wasmInitialized, setWasmInitialized] = useState(false);
	const [wasmError, setWasmError] = useState<string | null>(null);

	const abortController = new AbortController();

	// Initialize WASM in useEffect
	useEffect(() => {
		async function initializeWasm() {
			try {
				console.time("WASM initialization successful in");
				await init(); // Initialize WASM asynchronously
				setWasmInitialized(true);
				console.timeEnd("WASM initialization successful in");
			} catch (error) {
				setWasmError(
					error instanceof Error ? error.message : "Unknown WASM error",
				);
			}
		}

		initializeWasm();

		return () => {
			abortController.abort(); // Cleanup on unmount
		};
	}, [wasmInitialized, wasmError]);

	return { wasmInitialized, wasmError };
}
