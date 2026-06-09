// Create custom hooks file: hooks/useImageEditor.ts
import { useState, useCallback } from "react";

export const useImageEditor = () => {
	const [originalImgArr, setOriginalImgArr] = useState<Uint8Array>(
		new Uint8Array(),
	);
	const [editedImgArr, setEditedImgArr] = useState<Uint8Array>(
		new Uint8Array(),
	);
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

	const [refImgArr, setRefImgArr] = useState<Uint8Array>(new Uint8Array());
	const [imgUrl, setImgUrl] = useState<string | null>(null);
	const [imgRefUrl, setImgRefUrl] = useState<string | null>(null);
	const [refSize, setRefSize] = useState({ width: 0, height: 0 });
	const [isLoading, setIsLoading] = useState(false);

	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [welcomeOverlay, setWelcomeOverlay] = useState(true);

	const ArrToURL = useCallback((arr: Uint8Array): string => {
		return URL.createObjectURL(
			new Blob([new Uint8Array(arr)], { type: "image/png" }),
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
		refSize,
		setRefSize,
		imgRefUrl,
		setImgRefUrl,
		imageSize,
		setImageSize,
		isLoading,
		setIsLoading,
		windowSize,
		setWindowSize,
		welcomeOverlay,
		setWelcomeOverlay,
		// Utils
		ArrToURL,
	};
};

export function useZoom() {
	const [zoomLevel, setZoomLevel] = useState(1);
	const handleZoomReset = () => setZoomLevel(1);
	const handleZoomChange = (value: number[]) => {
		const newZoom = value[0] / 100; // Convert percentage to decimal
		setZoomLevel(Math.max(0.5, Math.min(newZoom, 2))); // Clamp between 0.5 and 3
	};

	const handleOnWheel = (event: WheelEvent) => {
		if (event.deltaY < 0) {
			setZoomLevel(Math.max(0.5, Math.min(zoomLevel + 0.1, 2)));
		} else if (event.deltaY > 0) {
			setZoomLevel(Math.max(0.5, Math.min(zoomLevel - 0.1, 2)));
		}
	};
	return {
		zoomLevel,
		handleZoomReset,
		handleZoomChange,
		handleOnWheel,
	};
}