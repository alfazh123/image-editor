import { useImageEditor } from "./useImageEditor";
import { useBenchmarkHook } from "./useBenchmark";
import { handleContrastsNative, handleExposureNative, handleSaturationNative, handleTemperatureNative, handleTintNative, swithColorNative } from "../native/func";
import { MenuFilter } from "../menu/type";

export const useNativeHook = (
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) => {
	const transferColor = async () => {
		console.time("Transfer color native completed in");
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
	};

	const saturation = async (value: number[]) => {
		// console.time('Adjust Saturation Native finish in');
		hook.setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));

		const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
			type: "image/png",
		});
		const result = await handleSaturationNative(
			blob,
			hook.colorVal.saturationValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Saturation Native finish in");
	};

	const temperature = async (value: number[]) => {
		console.time("Adjust Temperature Native finish in");
		hook.setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		console.log("Temperature value:", value[0]);
		const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
			type: "image/png",
		});
		const result = await handleTemperatureNative(
			blob,
			hook.colorVal.temperatureValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Temperature Native finish in");
	};

	const tint = async (value: number[]) => {
		console.time("Adjust Tint Native finish in");
		hook.setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));

		const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
			type: "image/png",
		});
		const result = await handleTintNative(blob, hook.colorVal.tintValue);
		// setEditImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	};

	const exposure = async (value: number[]) => {
		console.time("Adjust Tint Native finish in");
		hook.setLightVal((prev) => ({
			...prev,
			exposureValue: value[0],
		}));

		const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
			type: "image/png",
		});
		const result = await handleExposureNative(
			blob,
			hook.lightVal.exposureValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	};

	const contrast = async (value: number[]) => {
		console.time("Adjust Tint Native finish in");
		hook.setLightVal((prev) => ({
			...prev,
			contrastValue: value[0],
		}));

		const blob = new Blob([new Uint8Array(hook.originalImgArr)], {
			type: "image/png",
		});
		const result = await handleContrastsNative(
			blob,
			hook.lightVal.contrastValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	};

	const functionFilterNative = async (imageData: Uint8Array) => {
		hook.setIsLoading(true);
		if (hook.originalImgArr.length > 0 && imageData.length > 0) {
			const result = await swithColorNative(
				new Blob([new Uint8Array(hook.originalImgArr)], { type: "image/png" }),
				new Blob([new Uint8Array(imageData)], { type: "image/png" })
			);
			hook.setEditedImgArr(result);
			hook.setImgUrl(hook.ArrToURL(result));
			hook.setIsLoading(false);
		}
	};

	const noFilter = () => {
		hook.setIsLoading(true);
		hook.setImgUrl(hook.ArrToURL(hook.originalImgArr));
		hook.setIsLoading(false);
	};

	const filterMenuNative: MenuFilter[] = [
		{
			name: "No Filter",
			onChangeFilter: noFilter,
			color: "bg-slate-200",
		},
	];

	return {
		transferColor,
		saturation,
		temperature,
		tint,
		exposure,
		contrast,
		functionFilterNative,
		filterMenuNative,
	};
};