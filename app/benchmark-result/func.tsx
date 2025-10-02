import { BenchmarkResultProps, TransferColorAttempt } from "../menu/type";

function filterData(data: BenchmarkResultProps[], method: string) {
	return data
		.filter((item) => item.method === method)
		.map((item) => ({
			...item,
			time: (item.time / 1000).toFixed(2), // Convert to seconds
		}));
}

export function getBenchmarkData(
	data: BenchmarkResultProps[],
	transferColorAttempts: TransferColorAttempt[]
) {
	// const ct = filterData(data, "transferColor");
	const sharp = filterData(data, "sharp");
	const saturation = filterData(data, "saturation");
	const temperature = filterData(data, "temperature");
	const tint = filterData(data, "tint");
	const constrast = filterData(data, "contrast");
	const exposure = filterData(data, "exposure");

	const ct = transferColorAttempts.map((item) => ({
		...item,
		referenceSize: `${item.referenceSize.width}px X ${item.referenceSize.height}px`,
	}));

	const benchmarkData = [
		{
			name: "Color Transfer",
			data: ct,
		},
		{
			name: "Sharpness",
			data: sharp,
		},
		{
			name: "Saturation",
			data: saturation,
		},
		{
			name: "Temperature",
			data: temperature,
		},
		{
			name: "Tint",
			data: tint,
		},
		{
			name: "contrasts",
			data: constrast,
		},
		{
			name: "Exposure",
			data: exposure,
		},
	];

	return { benchmarkData };
}
