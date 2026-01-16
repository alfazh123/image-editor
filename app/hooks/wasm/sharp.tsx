import { sharpImageWASM } from "@/app/hooks/wasm/func";
import { useImageEditor } from "../useImageEditor";

export async function Sharp(
	hook: ReturnType<typeof useImageEditor>,
	value: number[]
) {
	console.time("Sharp image finish in");
	hook.setSharpVal(value[0]);
	const result = await sharpImageWASM(hook.originalImgArr, value[0]);
	hook.setEditedImgArr(result);
	// setEditImgArr(result);
	hook.setImgUrl(hook.ArrToURL(result));
	console.timeEnd("Sharp image finish in");
}
