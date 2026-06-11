import { useWasmHook } from "./useWasmEditor";

export function useHandleSlider(wasmHooks: ReturnType<typeof useWasmHook>) {
	// sharp image
	async function handleSharpChange(value: number[]) {
		wasmHooks.sharp(value);
	}

	// color
	async function handleSaturation(value: number[]) {
		wasmHooks.saturation(value);
	}

	async function handleTemperature(value: number[]) {
		wasmHooks.temperature(value);
	}

	async function handleTint(value: number[]) {
		wasmHooks.tint(value);
	}

	// light
	async function handleExposure(value: number[]) {
		wasmHooks.exposure(value);
	}

	async function handleContrast(value: number[]) {
		wasmHooks.contrast(value);
	}

	// color transfer
	async function handleTransferColor() {
		wasmHooks.transferColor();
	}

	return {
		handleSharpChange,
		handleSaturation,
		handleTemperature,
		handleTint,
		handleExposure,
		handleContrast,
		handleTransferColor,
	};
}