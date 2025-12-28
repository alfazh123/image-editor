import { transferColorWASM } from "@/app/hooks/wasm/func";
import { useImageEditor } from "../useImageEditor";

export async function TranferColor(hook: ReturnType<typeof useImageEditor>) {
	console.time("Transfer color WASM completed in");
	const result = await transferColorWASM(hook.originalImgArr, hook.refImgArr);
	hook.setEditedImgArr(result);
	// setEditImgArr(await result);
	hook.setImgUrl(hook.ArrToURL(result));
	hook.setIsLoading(false);
	console.timeEnd("Transfer color WASM completed in");
}

export async function TransferColorProvided(
	hook: ReturnType<typeof useImageEditor>,
	providedImgArr: Uint8Array
) {
	const result = transferColorWASM(hook.originalImgArr, providedImgArr);
	hook.setEditedImgArr(await result);
	hook.setImgUrl(hook.ArrToURL(await result));
	hook.setIsLoading(false);
	console.timeEnd("Filter apply finish in");
}