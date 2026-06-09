import { useState } from "react";
import { ColorValueProps } from "../wasm/type";
import { useImageEditor } from "./useImageEditor";
import { adjustSaturation, adjustTemperature, adjustTint } from "./wasm/func";

export function useColorProcessing() {
	const [colorVal, setColorVal] = useState<ColorValueProps>({
		saturationValue: 0,
		temperatureValue: 0,
		tintValue: 0,
	});

	async function Saturation(
		hook: ReturnType<typeof useImageEditor>,
		value: number[]
	) {
		console.time("Adjust Saturation finish in");
		const result = await adjustSaturation(hook.originalImgArr, value[0]);
		setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));
		hook.setEditedImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Saturation finish in");
	}

	async function Temperature(
		hook: ReturnType<typeof useImageEditor>,
		value: number[]
	) {
		console.time("Adjust Temperature finish in");
		const result = await adjustTemperature(hook.originalImgArr, value[0]);
		setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		hook.setEditedImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Temperature finish in");
	}

	async function Tint(
		hook: ReturnType<typeof useImageEditor>,
		value: number[]
	) {
		console.time("Adjust Tint finish in");
		const result = await adjustTint(hook.originalImgArr, value[0]);
		setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));
		hook.setEditedImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Tint finish in");
	}

	return {
		colorVal,
		setColorVal,
		Saturation,
		Temperature,
		Tint,
	};
}