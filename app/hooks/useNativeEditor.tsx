import { useImageEditor } from "./useImageEditor";
import { useBenchmarkHook } from "./useBenchmark";
import { MenuFilter } from "../menu/type";
import { useRef } from "react";
import { SharpNative } from "./native/sharp";
import {
	TransferColorNative,
	TransferColorProvidedNative,
} from "./native/transfer-color";
import {
	SaturationNative,
	TemperatureNative,
	TintNative,
} from "./native/color";
import { ContrastNative, ExposureNative } from "./native/light";

export const useNativeHook = (
	hook: ReturnType<typeof useImageEditor>,
	benchmarkHook: ReturnType<typeof useBenchmarkHook>
) => {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const sharp = async (value: number[]) => {
		hook.setSharpVal(value[0]);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			SharpNative(hook, benchmarkHook, value);
		}, 300);
	};

	const transferColor = async () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			TransferColorNative(hook, benchmarkHook);
		}, 300);
	};

	const saturation = async (value: number[]) => {
		hook.setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			SaturationNative(hook, benchmarkHook, value);
		}, 300);
	};

	const temperature = async (value: number[]) => {
		hook.setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			TemperatureNative(hook, benchmarkHook, value);
		}, 300);
	};

	const tint = async (value: number[]) => {
		hook.setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			TintNative(hook, benchmarkHook, value);
		}, 300);
	};

	const exposure = async (value: number[]) => {
		hook.setLightVal((prev) => ({
			...prev,
			exposureValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(async () => {
			ExposureNative(hook, benchmarkHook, value);
		}, 300);
	};

	const contrast = async (value: number[]) => {
		hook.setLightVal((prev) => ({
			...prev,
			contrastValue: value[0],
		}));
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(async () => {
			ContrastNative(hook, benchmarkHook, value);
		}, 300);
	};

	const functionFilterNative = async (imageData: Uint8Array) => {
		TransferColorProvidedNative(hook, benchmarkHook, imageData);
	};

	const noFilter = () => {
		hook.setIsLoading(true);
		hook.setImgUrl(hook.ArrToURL(hook.originalImgArr));
		hook.setIsLoading(false);
	};

	const filterMenuNative: MenuFilter[] = [
		{
			name: "No Filter",
			onChangeFilter: noFilter,
			color: "bg-slate-200",
		},
	];

	return {
		transferColor,
		sharp,
		saturation,
		temperature,
		tint,
		exposure,
		contrast,
		functionFilterNative,
		filterMenuNative,
	};
};