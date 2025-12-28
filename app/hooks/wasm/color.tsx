import {
	adjustSaturation,
	adjustTemperature,
	adjustTint,
} from "@/app/hooks/wasm/func";
import { useImageEditor } from "../useImageEditor";

export async function Saturation(
	hook: ReturnType<typeof useImageEditor>,
	value: number[]
) {
	console.time("Adjust Saturation finish in");
	const result = await adjustSaturation(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Saturation finish in");
}

export async function Temperature(
	hook: ReturnType<typeof useImageEditor>,
	value: number[]
) {
	console.time("Adjust Temperature finish in");
	const result = await adjustTemperature(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Temperature finish in");
}

export async function Tint(
	hook: ReturnType<typeof useImageEditor>,
	value: number[]
) {
	console.time("Adjust Tint finish in");
	const result = await adjustTint(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Adjust Tint finish in");
}
