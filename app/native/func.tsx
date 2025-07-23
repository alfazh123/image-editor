
async function processImage(
	path: string,
	formData: FormData
): Promise<Uint8Array> {
	try {
		const response = await fetch(`http://192.168.10.99:8080/${path}`, {
			method: "POST",
			body: formData,
		});
		if (response.ok) {
			const arr = new Uint8Array(await response.arrayBuffer());
			return arr;
		} else {
			const errorText = await response.text();
			console.error(
				"Failed to adjust temperature:",
				response.status,
				errorText
			);
			throw new Error(
				`Server responded with status ${response.status}: ${errorText}`
			);
		}
	} catch (error) {
		console.error("Error during color transfer:", error);
		return new Uint8Array();
	}
}

export async function fixSizeNative(imageSource: File): Promise<Uint8Array> {
	const formData = new FormData();
	formData.append("image_source", imageSource);

	const result = await processImage("fix_size", formData);
	return result;
}

interface SizeImage {
	width: number;
	height: number;
}

export async function getSizeNative(imageSource: Blob): Promise<SizeImage> {
	let sizeImage: SizeImage = { width: 0, height: 0 };
	const formData = new FormData();
	formData.append("image_source", imageSource);

	try {
		const response = await fetch("http://192.168.10.99:8080/get_size", {
			method: "POST",
			body: formData,
		});
		if (response.ok) {
			const json = await response.json();
			sizeImage = { width: json.width, height: json.height };
			return sizeImage;
		} else {
			const errorText = await response.text();
			console.error(
				"Failed to adjust temperature:",
				response.status,
				errorText
			);
			throw new Error(
				`Server responded with status ${response.status}: ${errorText}`
			);
		}
	} catch (error) {
		console.error("Error during color transfer:", error);
		return sizeImage;
	}
}

export async function swithColorNative(
	imageSource: Blob,
	imageReference: Blob
): Promise<Uint8Array> {
	const formData = new FormData();
	formData.append("image_source", imageSource);
	formData.append("image_reference", imageReference);

	const result = await processImage("switch_color", formData);
	return result;
}

export async function handleSaturationNative(
	imageSource: Blob,
	factorVal: number
): Promise<Uint8Array> {
	const factorJson = {
		factor: factorVal,
	};

	const factorBlob = new Blob([JSON.stringify(factorJson)], {
		type: "application/json",
	});

	const formData = new FormData();
	formData.append("image_source", imageSource);
	formData.append("factor", factorBlob);
	console.log(formData.get("factor"));

	const result = await processImage("adjust_saturation", formData);
	return result;
}

export async function handleTemperatureNative(
	imageSource: Blob,
	factorVal: number
): Promise<Uint8Array> {
	const factorJson = {
		factor: factorVal,
	};

	const factorBlob = new Blob([JSON.stringify(factorJson)], {
		type: "application/json",
	});

	const formData = new FormData();
	formData.append("image_source", imageSource);
	formData.append("factor", factorBlob);
	console.log(formData.get("factor"));

	const result = await processImage("adjust_temperature", formData);
	return result;
}

export async function handleTintNative(
	imageSource: Blob,
	factorVal: number
): Promise<Uint8Array> {
	const factorJson = {
		factor: factorVal,
	};

	const factorBlob = new Blob([JSON.stringify(factorJson)], {
		type: "application/json",
	});

	const formData = new FormData();
	formData.append("image_source", imageSource);
	formData.append("factor", factorBlob);
	console.log(formData.get("factor"));

	const result = await processImage("adjust_tint", formData);
	return result;
}

export async function handleExposureNative(
	imageSource: Blob,
	factorVal: number
): Promise<Uint8Array> {
	const factorJson = {
		factor: factorVal,
	};

	const factorBlob = new Blob([JSON.stringify(factorJson)], {
		type: "application/json",
	});

	const formData = new FormData();
	formData.append("image_source", imageSource);
	formData.append("factor", factorBlob);
	console.log("f", formData.get("factor"));

	const result = await processImage("adjust_exposure", formData);
	return result;
}

export async function handleContrastsNative(
	imageSource: Blob,
	factorVal: number
): Promise<Uint8Array> {
	const factorJson = {
		factor: factorVal,
	};

	const factorBlob = new Blob([JSON.stringify(factorJson)], {
		type: "application/json",
	});

	const formData = new FormData();
	formData.append("image_source", imageSource);
	formData.append("factor", factorBlob);

	const result = await processImage("adjust_contrast", formData);
	return result;
}