import { BenchmarkResultProps, TransferColorAttempt } from "../menu/type";

function filterData(data: BenchmarkResultProps[], method: string) {
	return data
		.filter((item) => item.method === method)
		.slice(0, 10)
		.map((item, id) => ({
			...item,
			time: (item.time / 1000).toFixed(2), // Convert to seconds
			label: id + 1,
		}));
}

export function getBenchmarkData(
	data: BenchmarkResultProps[],
	transferColorAttempts: TransferColorAttempt[],
	type: "WASM" | "NATIVE"
) {
	// const ct = filterData(data, "transferColor");
	const sharp = filterData(data, "sharp").map((item) => ({
		...item,
	}));
	const saturation = filterData(data, "saturation");
	const temperature = filterData(data, "temperature");
	const tint = filterData(data, "tint");
	const constrast = filterData(data, "contrast");
	const exposure = filterData(data, "exposure");

	const ct = transferColorAttempts
		.filter((item) => item.type === type)
		.map((item, id) => ({
			...item,
			referenceSize: `${item.referenceSize.width}px X ${item.referenceSize.height}px`,
			time: (item.time / 1000).toFixed(2), // Convert to seconds
			label: id + 1,
		}));

	const ctMean =
		ct.reduce((acc, item) => acc + parseFloat(item.time), 0) / ct.length;
	const sharpMean =
		sharp.reduce((acc, item) => acc + parseFloat(item.time), 0) / sharp.length;
	const saturationMean =
		saturation.reduce((acc, item) => acc + parseFloat(item.time), 0) /
		saturation.length;
	const temperatureMean =
		temperature.reduce((acc, item) => acc + parseFloat(item.time), 0) /
		temperature.length;
	const tintMean =
		tint.reduce((acc, item) => acc + parseFloat(item.time), 0) / tint.length;
	const contrastMean =
		constrast.reduce((acc, item) => acc + parseFloat(item.time), 0) /
		constrast.length;
	const exposureMean =
		exposure.reduce((acc, item) => acc + parseFloat(item.time), 0) /
		exposure.length;

	const benchmarkData = [
		{
			name: "Color Transfer",
			data: ct,
			mean: ctMean,
		},
		{
			name: "Sharpness",
			data: sharp,
			mean: sharpMean,
		},
		{
			name: "Saturation",
			data: saturation,
			mean: saturationMean,
		},
		{
			name: "Temperature",
			data: temperature,
			mean: temperatureMean,
		},
		{
			name: "Tint",
			data: tint,
			mean: tintMean,
		},
		{
			name: "Contrast",
			data: constrast,
			mean: contrastMean,
		},
		{
			name: "Exposure",
			data: exposure,
			mean: exposureMean,
		},
	];

	return { benchmarkData };
}

function filterDataMerge(
	wasm: BenchmarkResultProps[],
	native: BenchmarkResultProps[],
	method: string
) {
	const wasmData = wasm.filter((item) => item.method === method).slice(0, 10);
	const nativeData = native
		.filter((item) => item.method === method)
		.slice(0, 10);
	return wasmData.map((wasmItem, id) => {
		const nativeItem = nativeData[id];
		return {
			wasmTime: (wasmItem.time / 1000).toFixed(2), // Convert to seconds
			nativeTime: nativeItem ? (nativeItem.time / 1000).toFixed(2) : null,
			time: (wasmItem.time > nativeItem.time
				? wasmItem.time / 1000
				: (nativeItem ? nativeItem.time : 0) / 1000
			).toFixed(2),
			label: id + 1,
			internetWasm: {
				latency: wasmItem.latency,
				downloadSpeed: wasmItem.downloadSpeed,
				uploadSpeed: wasmItem.uploadSpeed,
			},
			internetNative: nativeItem
				? {
						latency: nativeItem.latency,
						downloadSpeed: nativeItem.downloadSpeed,
						uploadSpeed: nativeItem.uploadSpeed,
				  }
				: null,
			sizeWasm: {
				width: wasmItem.width,
				height: wasmItem.height,
			},
			sizeNative: nativeItem
				? {
						width: nativeItem.width,
						height: nativeItem.height,
				  }
				: null,
		};
	});
}

export function getBenchmarkDataMerge(
	wasmDataRaw: BenchmarkResultProps[],
	nativeDataRaw: BenchmarkResultProps[],
	transferColorAttempts: TransferColorAttempt[]
) {
	const sharpMerge = filterDataMerge(wasmDataRaw, nativeDataRaw, "sharp");
	const saturationMerge = filterDataMerge(
		wasmDataRaw,
		nativeDataRaw,
		"saturation"
	);
	const temperatureMerge = filterDataMerge(
		wasmDataRaw,
		nativeDataRaw,
		"temperature"
	);
	const tintMerge = filterDataMerge(wasmDataRaw, nativeDataRaw, "tint");
	const contrastMerge = filterDataMerge(wasmDataRaw, nativeDataRaw, "contrast");
	const exposureMerge = filterDataMerge(wasmDataRaw, nativeDataRaw, "exposure");

	const wasmCT = transferColorAttempts
		.filter((item) => item.type === "WASM")
		.slice(0, 5);
	const nativeCT = transferColorAttempts
		.filter((item) => item.type === "NATIVE")
		.slice(0, 5);

	const ctMerge = wasmCT.map((wasmItem, id) => {
		const nativeItem = nativeCT[id];
		return {
			referenceSize: `${wasmItem.referenceSize.width}px X ${wasmItem.referenceSize.height}px`,
			wasmTime: (wasmItem.time / 1000).toFixed(2), // Convert to seconds
			nativeTime: nativeItem ? (nativeItem.time / 1000).toFixed(2) : null,
			time: (
				(wasmItem.time + (nativeItem ? nativeItem.time : 0)) /
				1000
			).toFixed(2),
			label: id + 1,
			internetWasm: {
				latency: wasmItem.latency,
				downloadSpeed: wasmItem.downloadSpeed,
				uploadSpeed: wasmItem.uploadSpeed,
			},
			internetNative: nativeItem
				? {
						latency: nativeItem.latency,
						downloadSpeed: nativeItem.downloadSpeed,
						uploadSpeed: nativeItem.uploadSpeed,
				  }
				: null,
			sizeWasm: {
				width: wasmItem.width,
				height: wasmItem.height,
			},
			sizeNative: nativeItem
				? {
						width: nativeItem.width,
						height: nativeItem.height,
				  }
				: null,
		};
	});

	const mergeData = [
		{
			name: "Color Transfer",
			data: ctMerge,
		},
		{
			name: "Sharpness",
			data: sharpMerge,
		},
		{
			name: "Saturation",
			data: saturationMerge,
		},
		{
			name: "Temperature",
			data: temperatureMerge,
		},
		{
			name: "Tint",
			data: tintMerge,
		},
		{
			name: "Contrast",
			data: contrastMerge,
		},
		{
			name: "Exposure",
			data: exposureMerge,
		},
	];
	return { mergeData };
}