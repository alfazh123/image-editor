import {
	adjust_saturation_image,
	blur,
	fix_size_image,
	get_size,
	grayscale_image,
	sharpen,
	switch_color,
	adjust_contrasts_image,
	adjust_exposure_image,
	adjust_temperature_image,
	adjust_tint_image,
	adjust_color_image,
} from "rust-editor";

export function fixSize(img: Uint8Array): Uint8Array {
	try {
		// Call the Rust function to fix the image size
		const fixedImage = fix_size_image(img);
		// Return the fixed image as a Uint8Array
		return fixedImage;
	} catch (error) {
		console.error("Error fixing image size:", error);
		throw error; // Re-throw the error for further handling if needed
	}
}

export async function transferColorWASM(
	imgT: Uint8Array,
	imgR: Uint8Array
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));

		const result = switch_color(imgT, imgR);

		await new Promise((resolve) => setTimeout(resolve, 10));

		await new Promise((resolve) => setTimeout(resolve, 10));
		return result;
	} catch (error) {
		console.error("Error getting image dimensions:", error);
		//   setProcessingProgress(0);
		return new Uint8Array();
	}
}

export function getSizeImgWASM(imageData: Uint8Array): {
	width: number;
	height: number;
} {
	try {
		const dimensions = get_size(imageData);
		return { width: dimensions[0], height: dimensions[1] };
	} catch (error) {
		console.error("Error getting image dimensions:", error);
		return { width: 800, height: 600 };
	}
}

export async function blurImageWASM(
	imageData: Uint8Array,
	radius: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = blur(imageData, radius);
		return result;
	} catch (error) {
		console.error("Error blur image:", error);
		alert("Error while blur");
		return new Uint8Array();
	}
}

export async function sharpImageWASM(
	imageData: Uint8Array,
	radius: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = sharpen(imageData, radius);
		return result;
	} catch (error) {
		console.error("Error blur image:", error);
		alert("Error while blur");
		return new Uint8Array();
	}
}

export async function grayscaleImage(
	imageData: Uint8Array
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = grayscale_image(imageData);
		return result;
	} catch (error) {
		console.error("Error converting image to grayscale:", error);
		alert("Error while converting to grayscale");
		return new Uint8Array();
	}
}

export async function adjustSaturation(
	imageData: Uint8Array,
	saturation: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = adjust_saturation_image(imageData, saturation);
		return result;
	} catch (error) {
		console.error("Error adjusting saturation:", error);
		alert("Error while adjusting saturation");
		return new Uint8Array();
	}
}

export async function adjustContrasts(
	imageData: Uint8Array,
	contrasts: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = adjust_contrasts_image(imageData, contrasts);
		return result;
	} catch (error) {
		console.error("Error adjusting contrasts:", error);
		alert("Error while adjusting contrasts");
		return new Uint8Array();
	}
}

export async function adjustExposure(
	imageData: Uint8Array,
	exposure: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = adjust_exposure_image(imageData, exposure);
		return result;
	} catch (error) {
		console.error("Error adjusting exposure:", error);
		alert("Error while adjusting exposure");
		return new Uint8Array();
	}
}

export async function adjustTemperature(
	imageData: Uint8Array,
	temperature: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = adjust_temperature_image(imageData, temperature);
		return result;
	} catch (error) {
		console.error("Error adjusting temperature:", error);
		alert("Error while adjusting temperature");
		return new Uint8Array();
	}
}

export async function adjustTint(
	imageData: Uint8Array,
	tint: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 50));
		await new Promise((resolve) => setTimeout(resolve, 10));
		await new Promise((resolve) => setTimeout(resolve, 10));
		const result = adjust_tint_image(imageData, tint);
		return result;
	} catch (error) {
		console.error("Error adjusting tint:", error);
		alert("Error while adjusting tint");
		return new Uint8Array();
	}
}

export async function adjustColorWASM(
	imageData: Uint8Array,
	saturation: number,
	temperature: number,
	tint: number
): Promise<Uint8Array> {
	try {
		await new Promise((resolve) => setTimeout(resolve, 200));
		await new Promise((resolve) => setTimeout(resolve, 200));
		await new Promise((resolve) => setTimeout(resolve, 200));
		const result = adjust_color_image(imageData, saturation, temperature, tint);
		return result;
	} catch (error) {
		console.error("Error adjusting tint:", error);
		alert("Error while adjusting tint");
		return new Uint8Array();
	}
}

interface OutputInputImage {
	imgUrl: string;
	imgArr: Uint8Array;
}

export async function inputImage(
	e: React.ChangeEvent<HTMLInputElement>
): Promise<OutputInputImage> {
	try {
		const file = e.target.files?.[0];
		if (file) {
			const fixSizeImg = await fixSize(
				new Uint8Array(await file.arrayBuffer())
			);
			const imageUrl = URL.createObjectURL(
				new Blob([fixSizeImg], { type: "image/png" })
			);
			return {
				imgUrl: imageUrl,
				imgArr: fixSizeImg,
			};
		}
	} catch (error) {
		console.error("Error reading image file:", error);
	}
	return {
		imgUrl: "",
		imgArr: new Uint8Array(),
	};
}
