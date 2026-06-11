import { useImageEditor } from "./useImageEditor";
import { useInitWasm } from "./useWasmEditor";
import { getSizeImgWASM, inputImage } from "./wasm/func";

export function useInputImage(hook: ReturnType<typeof useImageEditor>, initWasm: ReturnType<typeof useInitWasm>, setIsAvailable: React.Dispatch<React.SetStateAction<boolean>>) {
    async function inputImageTarget(e: React.ChangeEvent<HTMLInputElement>) {
        if (!initWasm.wasmInitialized) {
            console.warn("WASM not initialized");
            return;
        } else {
            const { imgUrl, imgArr } = await inputImage(e);
            console.log("Input Image Array:", imgArr);
            console.log("Image URL:", imgUrl);
            hook.setImgUrl(imgUrl);
            hook.setOriginalImgArr(imgArr);
            setIsAvailable(true);
            hook.setImageSize(getSizeImgWASM(imgArr));
        }
    }

    async function inputRefImage(e: React.ChangeEvent<HTMLInputElement>) {
        if (!initWasm.wasmInitialized) {
            console.warn("WASM not initialized");
            return;
        } else {
            const { imgUrl, imgArr } = await inputImage(e);
            hook.setImgRefUrl(imgUrl);
            console.log("Reference Image URL:", imgUrl);
            hook.setRefImgArr(imgArr);
            hook.setRefSize(getSizeImgWASM(imgArr));
        }
    }

    return {
        inputImageTarget,
        inputRefImage,
    }
}