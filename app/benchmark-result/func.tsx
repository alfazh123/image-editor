import { BenchmarkResultProps } from "../menu/type";

function filterData(data: BenchmarkResultProps[], method: string, more = false) {
    return data.filter((item) => item.method === method && (more ? item.latency > 0 : item.latency === 0)).map((item) => ({
        ...item,
        time: (item.time / 1000).toFixed(2), // Convert to seconds
    }));
}

export function getBenchmarkData(data: BenchmarkResultProps[]) {
	const ct = filterData(data, "transferColor");
	const sharp = filterData(data, "sharp");
	const saturation = filterData(data, "saturation");
	const temperature = filterData(data, "temperature");
	const tint = filterData(data, "tint");
	const constrast = filterData(data, "contrast");
	const exposure = filterData(data, "exposure");

	const ctL = filterData(data, "transferColor", true);
	const sharpL = filterData(data, "sharp", true);
	const saturationL = filterData(data, "saturation", true);
	const temperatureL = filterData(data, "temperature", true);
	const tintL = filterData(data, "tint", true);
	const constrastL = filterData(data, "contrast", true);
	const exposureL = filterData(data, "exposure", true);

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

	const benchmarkDataLatency = [
		{
			name: "Color Transfer",
			data: ctL,
		},
		{
			name: "Sharpness",
			data: sharpL,
		},
		{
			name: "Saturation",
			data: saturationL,
		},
		{
			name: "Temperature",
			data: temperatureL,
		},
		{
			name: "Tint",
			data: tintL,
		},
		{
			name: "Contrasts",
			data: constrastL,
		},
		{
			name: "Exposure",
			data: exposureL,
		},
	];

	return { benchmarkData, benchmarkDataLatency };
}