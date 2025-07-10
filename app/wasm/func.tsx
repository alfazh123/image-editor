import { blur, fix_size_image, get_size, sharpen, switch_color } from "rust-editor";

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

export async function transferColorWASM(imgT: Uint8Array, imgR: Uint8Array): Promise<Uint8Array> {

    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      
    //   setProcessingProgress(25);
      await new Promise(resolve => setTimeout(resolve, 10));
      
    //   setProcessingProgress(50);
      await new Promise(resolve => setTimeout(resolve, 10));

      const result = switch_color(imgT, imgR)

    //   setProcessingProgress(75);
      await new Promise(resolve => setTimeout(resolve, 10));
  
    //   setEditImgArr(result);
    //   setImgUrl(ArrToURL(result));

    //   setProcessingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 10));

    //   setProcessingProgress(0);
    return result
    } catch(error) {
      console.error('Error getting image dimensions:', error);
    //   setProcessingProgress(0);
        return new Uint8Array();
    }
}

export function getSizeImgWASM(imageData: Uint8Array): {width: number, height: number} {
    try {
      const dimensions = get_size(imageData);
      return {width: dimensions[0], height: dimensions[1]};
    } catch (error) {
      console.error('Error getting image dimensions:', error);
      return {width: 800, height: 600};
    }
}

export async function blurImageWASM(imageData: Uint8Array, radius: number): Promise<Uint8Array> {
  try {
    await new Promise(resolve => setTimeout(resolve, 50));
    await new Promise(resolve => setTimeout(resolve, 10));
    await new Promise(resolve => setTimeout(resolve, 10));
    const result = blur(imageData, radius);
    return result
  } catch(error) {
    console.error('Error blur image:', error);
    alert("Error while blur")
    return new Uint8Array();
  }
}

export async function sharpImageWASM(imageData: Uint8Array, radius: number): Promise<Uint8Array> {
  try {
    await new Promise(resolve => setTimeout(resolve, 50));
    await new Promise(resolve => setTimeout(resolve, 10));
    await new Promise(resolve => setTimeout(resolve, 10));
    const result = sharpen(imageData, radius);
    return result
  } catch(error) {
    console.error('Error blur image:', error);
    alert("Error while blur")
    return new Uint8Array();
  }
}