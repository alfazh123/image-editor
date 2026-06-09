import { useState } from "react";
import { LightValueProps } from "../wasm/type";
import { useImageEditor } from "./useImageEditor";
import { adjustContrasts, adjustExposure } from "./wasm/func";

export function useLightProcessing() {
    const [lightVal, setLightVal] = useState<LightValueProps>({
        exposureValue: 0,
        contrastValue: 0,
    });

    async function Exposure(
        hook: ReturnType<typeof useImageEditor>,
        value: number[],
    ) {
        console.time("Adjust Exposure finish in");
        setLightVal((prev) => ({
            ...prev,
            exposureValue: value[0],
        }));
        const result = await adjustExposure(hook.originalImgArr, value[0]);
        hook.setEditedImgArr(result);

        hook.setImgUrl(hook.ArrToURL(result));
        console.timeEnd("Adjust Exposure finish in");
    }

    async function Contrast(
        hook: ReturnType<typeof useImageEditor>,
        value: number[],
    ) {
        console.time("Adjust Contrast finish in");
        setLightVal((prev) => ({
            ...prev,
            contrastValue: value[0],
        }));
        const result = await adjustContrasts(hook.originalImgArr, value[0]);
        hook.setEditedImgArr(result);
        // setEditImgArr(result);
        hook.setImgUrl(hook.ArrToURL(result));
        console.timeEnd("Adjust Contrast finish in");
    }

    return {
        lightVal,
        setLightVal,
        Exposure,
        Contrast,
    };
}