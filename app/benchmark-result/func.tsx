import { BenchmarkResultProps, TransferColorAttempt } from "../menu/type";

function filterData(data: BenchmarkResultProps[], method: string) {
	return data
		.filter((item) => item.method === method)
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
