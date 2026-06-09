import { useState } from "react";
import { useImageEditor } from "./useImageEditor";
import { sharpImageWASM } from "./wasm/func";

export function useSharpPRocess() {
    const [sharpVal, setSharpVal] = useState(0);
    
    async function Sharp(
        hook: ReturnType<typeof useImageEditor>,
        value: number[]
    ) {
        console.log("Sharp value set to:", value[0]);
        console.time("Sharp image finish in");
        setSharpVal(value[0]);
        const result = await sharpImageWASM(hook.originalImgArr, value[0]);
        hook.setEditedImgArr(result);
        hook.setImgUrl(hook.ArrToURL(result));
        console.timeEnd("Sharp image finish in");
    }

    return {
        sharpVal,
        setSharpVal,
        Sharp,
    };
}