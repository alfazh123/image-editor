'use client';

import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { Droppable } from "../dnd/droppable";
import { Draggable } from "../dnd/draggable";
import { getWindowSize } from "../dnd/get-window-size";
import { Redo } from "lucide-react";

import {
	ColorTransfer,
	DisplaySize,
	DownloadImage,
	Sharp,
	Tools,
} from "../menu/menu";
import { StatusBanner } from "@/components/status-banner";
import { InputBanner } from "@/components/input-banner";

import init from "rust-editor";
import {
	adjustColorWASM,
	adjustContrasts,
	adjustExposure,
	getSizeImgWASM,
	grayscaleImage,
	inputImage,
	sharpImageWASM,
	transferColorWASM,
} from "./func";
import { filterMenuItems } from "../data";

import { ToolsProps, MenuFilter } from "../menu/type";
import { useImageEditor } from "../hooks/useImageEditor";

export default function Wasm() {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
	const [isOnCanvas, setIsOnCanvas] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
	const [isAvailable, setIsAvailable] = useState(false);

	const [welcomeOverlay, setWelcomeOverlay] = useState(true);

	const hook = useImageEditor();

	const [wasmInitialized, setWasmInitialized] = useState(false);
	const [wasmError, setWasmError] = useState<string | null>(null);

	// const [isLoading, setIsLoading] = useState<boolean>(false);

	// Initialize WASM in useEffect
	useEffect(() => {
		async function initializeWasm() {
			try {
				console.time("WASM initialization successful in");
				await init(); // Initialize WASM asynchronously
				setWasmInitialized(true);
				console.timeEnd("WASM initialization successful in");
			} catch (error) {
				console.error("Failed to initialize WASM:", error);
				setWasmError(
					error instanceof Error ? error.message : "Unknown WASM error"
				);
			}
		}

		initializeWasm();
	}, [wasmInitialized, wasmError]);

	async function inputImageTarget(e: React.ChangeEvent<HTMLInputElement>) {
		if (!wasmInitialized) {
			console.warn("WASM not initialized");
			return;
		} else {
			const { imgUrl, imgArr } = await inputImage(e);
			console.log("Image URL:", imgUrl);
			hook.setImgUrl(imgUrl);
			hook.setOriginalImgArr(imgArr);
			setIsAvailable(true);
			hook.setImageSize(await getSizeImgWASM(imgArr));
		}
	}

	async function inputRefImage(e: React.ChangeEvent<HTMLInputElement>) {
		if (!wasmInitialized) {
			console.warn("WASM not initialized");
			return;
		} else {
			const { imgUrl, imgArr } = await inputImage(e);
			hook.setImgRefUrl(imgUrl);
			console.log("Reference Image URL:", imgUrl);
			hook.setRefImgArr(imgArr);
		}
	}

	// Function to process transfer color with WASM
	async function handleTransferColor() {
		console.time("Transfer color WASM completed in");
		hook.setIsLoading(true);
		// Do not log isLoading here, as it won't reflect the updated value immediately
		if (hook.originalImgArr.length > 0 && hook.refImgArr.length > 0) {
			console.log("Transfer Color with WASM");
			// transferColor(originalImgArr, refImgArr);

			const result = transferColorWASM(hook.originalImgArr, hook.refImgArr);
			// setEditImgArr(await result);
			hook.setImgUrl(ArrToURL(await result));
			hook.setIsLoading(false);
			console.timeEnd("Transfer color WASM completed in");
		} else {
			hook.setIsLoading(false);
			alert("No image data available for transfer color");
		}
	}

	// handle grayscale image with WASM
	async function handleGrayscaleImage() {
		console.time("Grayscale finish in");
		hook.setIsLoading(true);
		if (hook.originalImgArr.length == 0) {
			hook.setIsLoading(false);
			alert("No image data available for grayscaling");
		}
		const result = grayscaleImage(hook.originalImgArr);
		hook.setImgUrl(ArrToURL(await result));
		hook.setIsLoading(false);
		console.timeEnd("Grayscale finish in");
	}

	function handleNoFilter() {
		hook.setIsLoading(true);
		hook.setImgUrl(ArrToURL(hook.originalImgArr));
		hook.setIsLoading(false);
	}

	const filterMenu: MenuFilter[] = [
		{
			name: "No Filter",
			onChangeFilter: handleNoFilter,
			color: "bg-slate-200",
		},
		{
			name: "Grayscale",
			onChangeFilter: handleGrayscaleImage,
			color: "bg-gray-400",
		},
	];

	async function handleFunctionFilter(imageData: Uint8Array) {
		console.time("Filter apply finish in");
		hook.setIsLoading(true);
		// Do not log isLoading here, as it won't reflect the updated value immediately
		if (hook.originalImgArr.length > 0 && imageData.length > 0) {
			const result = transferColorWASM(hook.originalImgArr, imageData);
			// setEditImgArr(await result);
			hook.setImgUrl(ArrToURL(await result));
			hook.setIsLoading(false);
			console.timeEnd("Filter apply finish in");
		} else {
			hook.setIsLoading(false);
			alert("No image data available for transfer color");
		}
	}

	filterMenuItems.map((item) => {
		filterMenu.push({
			name: item.label,
			onChangeFilter: async () => {
				const response = await fetch(item.imgUrl);
				const blob = await response.blob();
				const buffer = await blob.arrayBuffer();
				handleFunctionFilter(new Uint8Array(buffer));
			},
			color: item.backgroundColor,
			backgroundImage: item.imgUrl,
		});
	});

	// sharp image
	async function handleSharpChange(value: number[]) {
		console.time("Sharp image finish in");
		hook.setIsLoading(true);
		hook.setSharpVal(value[0]);
		const result = await sharpImageWASM(hook.originalImgArr, value[0]);
		// setEditImgArr(result);
		hook.setImgUrl(ArrToURL(result));
		hook.setIsLoading(false);
		console.timeEnd("Sharp image finish in");
	}

	// color
	async function handleSaturation(value: number[]) {
		console.time("Adjust Saturation finish in");
		hook.setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));
		const result = await adjustColorWASM(
			hook.originalImgArr,
			value[0],
			hook.colorVal.temperatureValue,
			hook.colorVal.tintValue
		);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Saturation finish in");
	}

	async function handleTemperature(value: number[]) {
		console.time("Adjust Temperature finish in");
		hook.setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		const result = await adjustColorWASM(
			hook.originalImgArr,
			hook.colorVal.saturationValue,
			value[0],
			hook.colorVal.tintValue
		);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Temperature finish in");
	}

	async function handleTint(value: number[]) {
		console.time("Adjust Tint finish in");
		hook.setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));
		const result = await adjustColorWASM(
			hook.originalImgArr,
			hook.colorVal.saturationValue,
			hook.colorVal.temperatureValue,
			value[0]
		);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Tint finish in");
	}

	// light
	async function handleExposure(value: number[]) {
		console.time("Adjust Exposure finish in");
		hook.setLightVal((prev) => ({
			...prev,
			exposureValue: value[0],
		}));
		const result = await adjustExposure(
			hook.originalImgArr,
			hook.lightVal.exposureValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Exposure finish in");
	}

	async function handleContrast(value: number[]) {
		console.time("Adjust Contrast finish in");
		hook.setLightVal((prev) => ({
			...prev,
			contrastValue: value[0],
		}));
		const result = await adjustContrasts(
			hook.originalImgArr,
			hook.lightVal.contrastValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Contrast finish in");
	}

	function ArrToURL(arr: Uint8Array): string {
		const blob = new Blob([arr], { type: "image/png" });
		const url = URL.createObjectURL(blob);
		return url;
	}

	// Initialize window size and item position on mount
	useEffect(() => {
		const handleResize = () => {
			if (typeof window !== "undefined") {
				const windowSize = getWindowSize();
				const newWidth = windowSize.width;
				const newHeight = windowSize.height;
				setWindowSize({ width: newWidth, height: newHeight });

				// Only set initial position once
				if (!isInitialized) {
					setItemPosition({
						x: newWidth > 400 ? newWidth / 2.2 : 0,
						y: newWidth > 400 ? newHeight / 2.5 : newHeight / 2,
					});
					setIsInitialized(true);
				}
			}
		};

		handleResize(); // Set initial size
		window.addEventListener("resize", handleResize);
		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isInitialized]);

	// Handle drag end event
	function handleDragEnd(event: DragEndEvent): void {
		const { over, delta } = event;

		if (over && over.id === "canvas") {
			if (isOnCanvas) {
				// Move existing item on canvas
				setItemPosition((prev) => ({
					x: prev.x + delta.x,
					y: prev.y + delta.y,
				}));
			} else {
				// Place item from toolbar to canvas
				setItemPosition({
					x: delta.x + 100, // Offset from drag start
					y: delta.y + 100,
				});
				setIsOnCanvas(true);
			}
		}
	}

	function closeWelcomeOverlay() {
		setTimeout(() => {
			setWelcomeOverlay(false);
		}, 2000);
	}

	// Don't render until initialized
	if (!isInitialized) {
		return (
			<div className="h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	const toolsItem: ToolsProps = {
		colorItem: [
			{
				value: hook.colorVal.saturationValue,
				id: "saturation-slider",
				onChange: handleSaturation,
				className: "bg-slate-200",
			},
			{
				value: hook.colorVal.temperatureValue,
				id: "temperature-slider",
				onChange: handleTemperature,
				className: "bg-gradient-to-r from-blue-400 via-slate-200 to-yellow-200",
			},
			{
				value: hook.colorVal.tintValue,
				id: "tint-slider",
				onChange: handleTint,
				className:
					"bg-gradient-to-r from-green-400 via-slate-200 to-fuchsia-400",
			},
		],
		lightItem: [
			{
				value: hook.lightVal.exposureValue,
				id: "exposure-slider",
				onChange: handleExposure,
			},
			{
				value: hook.lightVal.contrastValue,
				id: "contrast-slider",
				onChange: handleContrast,
			},
		],
	};

	return (
		<div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			<DndContext
				onDragStart={closeWelcomeOverlay} // Hide overlay when drag starts
				onDragEnd={handleDragEnd}>
				{/* Toolbar */}
				{hook.imgUrl && (
					<nav className="fixed flex items-center top-50 bottom-50 right-0 z-50 bg-white shadow-lg border-b w-16 m-4 rounded-2xl justify-center">
						<div className="flex flex-col max-w-7xl mx-auto">
							{/* Transfer Color Tool */}
							<ColorTransfer
								onClick={handleTransferColor}
								onChange={inputRefImage}
								imgRefUrl={hook.imgRefUrl}
								menuFilter={filterMenu}
							/>
							{/* Sharp Tool */}
							<Sharp
								value={hook.sharpVal}
								id="sharp-slider"
								onChange={handleSharpChange}
							/>

							{/* Blur Tool */}
							<Tools
								colorItem={toolsItem.colorItem}
								lightItem={toolsItem.lightItem}
							/>

							<DisplaySize
								width={hook.imageSize.width}
								height={hook.imageSize.height}
							/>

							<DownloadImage url={hook.imgUrl} />
						</div>
					</nav>
				)}

				{/* Canvas Area */}
				<div className="">
					{" "}
					{/* Offset for fixed toolbar */}
					<Droppable id="canvas" className="h-screen relative">
						{/* Grid pattern for visual reference */}
						<div className="absolute inset-0 opacity-20">
							<div
								className="w-full h-full"
								style={{
									backgroundImage: `
										linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
										linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
									`,
									backgroundSize: "20px 20px",
								}}
							/>
						</div>

						{!hook.imgUrl && (
							<StatusBanner
								title="This page use WASM for image processing."
								initialized={wasmInitialized}
								error={wasmError}
							/>
						)}

						<Draggable
							id="single-item"
							position={itemPosition}
							windowSize={windowSize}
							isAvailable={isAvailable}>
							{welcomeOverlay && (
								<div
									className={`absolute md:-top-0 md:-right-40 -top-10 right-40 z-50 ${
										welcomeOverlay || !hook.imgUrl ? "flex" : "hidden"
									}`}>
									<h2 className="flex gap-2 text-2xl font-bold mb-4 text-gray-600 md:rotate-12 -rotate-12">
										<Redo className="transform scale-150 -scale-x-150 -rotate-45" />
										👋 Drag this
									</h2>
								</div>
							)}
							<InputBanner
								imageSize={hook.imageSize}
								windowSize={windowSize}
								imgUrl={hook.imgUrl}
								isLoading={hook.isLoading}
								isAvailable={isAvailable}
								inputImage={inputImageTarget}
							/>
						</Draggable>
					</Droppable>
				</div>
			</DndContext>
		</div>
	);
}
