import { adjustContrasts, adjustExposure } from "@/app/hooks/wasm/func";
import { useImageEditor } from "../useImageEditor";

export async function Exposure(
	hook: ReturnType<typeof useImageEditor>,
	value: number[]
) {
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
}

export async function Contrast(
	hook: ReturnType<typeof useImageEditor>,
	value: number[]
) {
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
}
