// Create custom hooks file: hooks/useImageEditor.ts
import { useState, useCallback } from 'react';
import { ColorValueProps, LightValueProps } from '../wasm/type';

export const useImageEditor = () => {
	const [originalImgArr, setOriginalImgArr] = useState<Uint8Array>(
		new Uint8Array()
	);
	const [editedImgArr, setEditedImgArr] = useState<Uint8Array>(
		new Uint8Array()
	);
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

	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [welcomeOverlay, setWelcomeOverlay] = useState(true);

	const [zoomLevel, setZoomLevel] = useState(1);
	const handleZoomReset = () => setZoomLevel(1);
	const handleZoomChange = (value: number[]) => {
		const newZoom = value[0] / 100; // Convert percentage to decimal
		setZoomLevel(Math.max(0.5, Math.min(newZoom, 2))); // Clamp between 0.5 and 3
	};

	const handleOnWheel = (event: any) => {
		if (event.deltaY < 0) {
			setZoomLevel(Math.max(0.5, Math.min(zoomLevel + 0.1, 2)));
		} else if (event.deltaY > 0) {
			setZoomLevel(Math.max(0.5, Math.min(zoomLevel - 0.1, 2)));
		}
	};

	const ArrToURL = useCallback((arr: Uint8Array): string => {
		return URL.createObjectURL(
			new Blob([new Uint8Array(arr)], { type: "image/png" })
		);
	}, []);

	return {
		// States
		originalImgArr,
		setOriginalImgArr,
		editedImgArr,
		setEditedImgArr,
		refImgArr,
		setRefImgArr,
		imgUrl,
		setImgUrl,
		imgRefUrl,
		setImgRefUrl,
		imageSize,
		setImageSize,
		isLoading,
		setIsLoading,
		sharpVal,
		setSharpVal,
		lightVal,
		setLightVal,
		colorVal,
		setColorVal,
		windowSize,
		setWindowSize,
		welcomeOverlay,
		setWelcomeOverlay,
		zoomLevel,
		setZoomLevel,
		handleZoomReset,
		handleZoomChange,
		handleOnWheel,
		// Utils
		ArrToURL,
	};
};