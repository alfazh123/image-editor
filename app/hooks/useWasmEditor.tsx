import { MenuFilter } from "../menu/type";
import { adjustColorWASM, adjustContrasts, adjustExposure, adjustSaturation, adjustTemperature, adjustTint, grayscaleImage, sharpImageWASM, transferColorWASM } from "../wasm/func";
import { useImageEditor } from "./useImageEditor";

export const useWasmHook = (hook: ReturnType<typeof useImageEditor>) => {

    const transferColor = async () => {
        console.time("Transfer color WASM completed in");
        hook.setIsLoading(true);
        // Do not log isLoading here, as it won't reflect the updated value immediately
        if (hook.editedImgArr.length > 0 && hook.refImgArr.length > 0) {
            console.log("Transfer Color with WASM");
            const result = transferColorWASM(hook.editedImgArr, hook.refImgArr);
            hook.setEditedImgArr(await result);
            // setEditImgArr(await result);
            hook.setImgUrl(hook.ArrToURL(await result));
            hook.setIsLoading(false);
            console.timeEnd("Transfer color WASM completed in");
        } else {
            hook.setIsLoading(false);
            alert("No image data available for transfer color");
        }
    }

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
    }

    const noFilter = () => {
        hook.setIsLoading(true);
		hook.setImgUrl(hook.ArrToURL(hook.originalImgArr));
		hook.setIsLoading(false);
    }

    const functionFilter = async (imageData: Uint8Array) => {
        console.time("Filter apply finish in");
        hook.setIsLoading(true);
        // Do not log isLoading here, as it won't reflect the updated value immediately
        if (hook.editedImgArr.length > 0 && imageData.length > 0) {
            const result = transferColorWASM(hook.editedImgArr, imageData);
            // setEditImgArr(await result);
            hook.setEditedImgArr(await result);
            hook.setImgUrl(hook.ArrToURL(await result));
            hook.setIsLoading(false);
            console.timeEnd("Filter apply finish in");
        } else {
            hook.setIsLoading(false);
            alert("No image data available for transfer color");
        }
    }

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

    const sharp = async (value: number[]) => {
        console.time("Sharp image finish in");
        hook.setSharpVal(value[0]);
        const result = await sharpImageWASM(hook.originalImgArr, value[0]);
        hook.setEditedImgArr(result);
        // setEditImgArr(result);
        hook.setImgUrl(hook.ArrToURL(result));
        console.timeEnd("Sharp image finish in");
    }

    const saturation = async (value: number[]) => {
        console.time("Adjust Saturation finish in");
        hook.setColorVal((prev) => ({
            ...prev,
            saturationValue: value[0],
        }));
        const result = await adjustSaturation(
            hook.editedImgArr,
            value[0],
        );
        hook.setEditedImgArr(result);
        hook.setImgUrl(hook.ArrToURL(result));
        console.timeEnd("Adjust Saturation finish in");
    }

    const temperature = async (value: number[]) => {
        console.time("Adjust Temperature finish in");
        hook.setColorVal((prev) => ({
            ...prev,
            temperatureValue: value[0],
        }));
        const result = await adjustTemperature(
            hook.editedImgArr,
            value[0]
        );
        hook.setEditedImgArr(result);
        hook.setImgUrl(hook.ArrToURL(result));
        console.timeEnd("Adjust Temperature finish in");
    }

    const tint = async (value: number[]) => {
        console.time("Adjust Temperature finish in");
        hook.setColorVal((prev) => ({
            ...prev,
            tintValue: value[0],
        }));
        const result = await adjustTint(
            hook.editedImgArr,
            value[0]
        );
        hook.setEditedImgArr(result);
        hook.setImgUrl(hook.ArrToURL(result));
        console.timeEnd("Adjust Temperature finish in");
    }

    const exposure = async (value: number[]) => {
            console.time("Adjust Exposure finish in");
            hook.setLightVal((prev) => ({
                ...prev,
                exposureValue: value[0],
            }));
            const result = await adjustExposure(
                hook.originalImgArr,
                value[0]
            );
            hook.setEditedImgArr(result);
            // setEditImgArr(result);
            hook.setImgUrl(hook.ArrToURL(result));
            console.timeEnd("Adjust Exposure finish in");
        }

    const contrast = async (value: number[]) => {
            console.time("Adjust Exposure finish in");
            hook.setLightVal((prev) => ({
                ...prev,
                contrastValue: value[0],
            }));
            const result = await adjustContrasts(
                hook.originalImgArr,
                value[0]
            );
            hook.setEditedImgArr(result);
            // setEditImgArr(result);
            hook.setImgUrl(hook.ArrToURL(result));
            console.timeEnd("Adjust Exposure finish in");
        }

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
    }
}