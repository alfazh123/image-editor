// Create custom hooks file: hooks/useImageEditor.ts
import { useState, useCallback } from 'react';
import { ColorValueProps, LightValueProps } from '../wasm/type';

export const useImageEditor = () => {
    const [originalImgArr, setOriginalImgArr] = useState<Uint8Array>(new Uint8Array());
    const [refImgArr, setRefImgArr] = useState<Uint8Array>(new Uint8Array());
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [imgRefUrl, setImgRefUrl] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [isLoading, setIsLoading] = useState(false);
    
    const [sharpVal, setSharpVal] = useState(0);
    const [lightVal, setLightVal] = useState<LightValueProps>({
        exposureValue: 0,
        contrastValue: 0,
    });
    const [colorVal, setColorVal] = useState<ColorValueProps>({
        saturationValue: 0,
        temperatureValue: 0,
        tintValue: 0,
    });

    const ArrToURL = useCallback((arr: Uint8Array): string => {
        return URL.createObjectURL(new Blob([arr], { type: "image/png" }));
    }, []);

    return {
        // States
        originalImgArr, setOriginalImgArr,
        refImgArr, setRefImgArr,
        imgUrl, setImgUrl,
        imgRefUrl, setImgRefUrl,
        imageSize, setImageSize,
        isLoading, setIsLoading,
        sharpVal, setSharpVal,
        lightVal, setLightVal,
        colorVal, setColorVal,
        // Utils
        ArrToURL
    };
};