import { sharpImageWASM } from "@/app/wasm/func";
import { useBenchmarkHook } from "../useBenchmark";
import { useImageEditor } from "../useImageEditor";

export async function Sharp(hook: ReturnType<typeof useImageEditor>, benchmarkHook: ReturnType<typeof useBenchmarkHook>, value: number[]) {
    const start = performance.now();
    console.time("Sharp image finish in");
    hook.setSharpVal(value[0]);
    const result = await sharpImageWASM(hook.originalImgArr, value[0]);
    hook.setEditedImgArr(result);
    // setEditImgArr(result);
    hook.setImgUrl(hook.ArrToURL(result));
    console.timeEnd("Sharp image finish in");
    const end = performance.now();
    const time = end - start;
    
    benchmarkHook.setBenchmarkWASM((prev) => [
        ...prev,
        {
            latency: benchmarkHook.resultSpeed?.latency ?? 0,
            method: "sharp",
            time,
            width: hook.imageSize.width,
            height: hook.imageSize.height,
        },
    ]);
    benchmarkHook.resultSpeed?.latency
        ? benchmarkHook.setTestAttemptsLatency((prev) => ({
            ...prev,
            sharpness: prev.sharpness + 1,
        }))
        : benchmarkHook.setTestAttempts((prev) => ({
            ...prev,
            sharpness: prev.sharpness + 1,
    }));
}