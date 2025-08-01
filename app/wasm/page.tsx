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
	SpeedTestMenu,
	Tools,
} from "../menu/menu";
import { StatusBanner } from "@/components/status-banner";
import { InputBanner } from "@/components/input-banner";

import init from "rust-editor";
import { getSizeImgWASM, inputImage } from "./func";
import { filterMenuItems } from "../data";

import { ToolsProps } from "../menu/type";
import { useImageEditor } from "../hooks/useImageEditor";
import { ZoomControls } from "@/components/zoom-controls";
import { useWasmHook } from "../hooks/useWasmEditor";
import { Button } from "@/components/ui/button";
import { useSpeedTestHook } from "../hooks/useSpeedTest";

export default function Wasm() {
	const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
	const [isOnCanvas, setIsOnCanvas] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
	const [isAvailable, setIsAvailable] = useState(false);

	const hook = useImageEditor();
	const wasmHooks = useWasmHook(hook);
	const speedTestHook = useSpeedTestHook();

	const [wasmInitialized, setWasmInitialized] = useState(false);
	const [wasmError, setWasmError] = useState<string | null>(null);

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
			hook.setEditedImgArr(imgArr);
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
		wasmHooks.transferColor();
	}

	filterMenuItems.map((item) => {
		wasmHooks.filterMenu.push({
			name: item.label,
			onChangeFilter: async () => {
				const response = await fetch(item.imgUrl);
				const blob = await response.blob();
				const buffer = await blob.arrayBuffer();
				wasmHooks.functionFilter(new Uint8Array(buffer));
			},
			color: item.backgroundColor,
			backgroundImage: item.imgUrl,
		});
	});

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

	// Initialize window size and item position on mount
	useEffect(() => {
		const handleResize = () => {
			if (typeof window !== "undefined") {
				const windowSize = getWindowSize();
				const newWidth = windowSize.width;
				const newHeight = windowSize.height;
				hook.setWindowSize({ width: newWidth, height: newHeight });

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
					x: delta.x, // Offset from drag start
					y: delta.y,
				});
				setIsOnCanvas(true);
			}
		}
	}

	function closeWelcomeOverlay() {
		setTimeout(() => {
			hook.setWelcomeOverlay(false);
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
				title: "Saturation",
				value: hook.colorVal.saturationValue,
				id: "saturation-slider",
				onChange: handleSaturation,
				className: "bg-slate-200",
			},
			{
				title: "Temperature",
				value: hook.colorVal.temperatureValue,
				id: "temperature-slider",
				onChange: handleTemperature,
				className: "bg-gradient-to-r from-blue-400 via-slate-200 to-yellow-200",
			},
			{
				title: "Tint",
				value: hook.colorVal.tintValue,
				id: "tint-slider",
				onChange: handleTint,
				className:
					"bg-gradient-to-r from-green-400 via-slate-200 to-fuchsia-400",
			},
		],
		lightItem: [
			{
				title: "Exposure",
				value: hook.lightVal.exposureValue,
				id: "exposure-slider",
				onChange: handleExposure,
			},
			{
				title: "Contrast",
				value: hook.lightVal.contrastValue,
				id: "contrast-slider",
				onChange: handleContrast,
			},
		],
	};

	return (
		<div
			className="h-screen bg-gradient-to-br from-gray-50 to-blue-50"
			onWheel={isAvailable ? hook.handleOnWheel : () => {}}>
			<DndContext
				onDragStart={closeWelcomeOverlay} // Hide overlay when drag starts
				onDragEnd={handleDragEnd}>
				{/* Toolbar */}
				{hook.imgUrl && (
					<div className="fixed flex flex-col items-center md:top-50 md:bottom-50 md:right-0 md:left-auto bottom-4 left-0 right-0 z-50 rounded-2xl justify-center">
						<nav className="flex items-center z-50 bg-transparent backdrop-blur-3xl shadow-lg border-b md:w-14 w-full m-4 rounded-2xl md:justify-center justify-between">
							<div className="flex md:flex-col w-full">
								{/* Transfer Color Tool */}

								<ColorTransfer
									onClick={handleTransferColor}
									onChange={inputRefImage}
									imgRefUrl={hook.imgRefUrl}
									menuFilter={wasmHooks.filterMenu}
									windowSize={hook.windowSize}
								/>
								{/* Sharp Tool */}
								<Sharp
									value={hook.sharpVal}
									id="sharp-slider"
									onChange={handleSharpChange}
									windowSize={hook.windowSize}
								/>

								{/* Blur Tool */}
								<Tools
									colorItem={toolsItem.colorItem}
									lightItem={toolsItem.lightItem}
									windowSize={hook.windowSize}
								/>

								<DisplaySize
									width={hook.imageSize.width}
									height={hook.imageSize.height}
									windowSize={hook.windowSize}
								/>

								<DownloadImage url={hook.imgUrl} />

								<SpeedTestMenu
									runSpeedTest={speedTestHook.runSpeedTest}
									isLoading={speedTestHook.isLoading}
									isFinished={speedTestHook.isFinished}
									resultSpeed={speedTestHook.resultSpeed}
									error={speedTestHook.error}
									windowSize={hook.windowSize}
								/>
							</div>
						</nav>

						<ZoomControls
							zoomLevel={hook.zoomLevel}
							onZoomReset={hook.handleZoomReset}
							onZoomChange={hook.handleZoomChange}
						/>
					</div>
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
										linear-gradient(rgba(0,0,0,0.1) 2px, transparent 2px),
										linear-gradient(90deg, rgba(0,0,0,0.1) 2px, transparent 2px)
									`,
									backgroundSize: `${20 * hook.zoomLevel}px ${
										20 * hook.zoomLevel
									}px`,
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
							windowSize={hook.windowSize}
							isAvailable={isAvailable}>
							{hook.welcomeOverlay && (
								<div
									className={`absolute md:-top-0 md:-right-40 -top-10 right-40 z-50 ${
										hook.welcomeOverlay || !hook.imgUrl ? "flex" : "hidden"
									}`}>
									<h2 className="flex gap-2 text-2xl font-bold mb-4 text-gray-600 md:rotate-12 -rotate-12">
										<Redo className="transform scale-150 -scale-x-150 -rotate-45" />
										👋 Drag this
									</h2>
								</div>
							)}
							<InputBanner
								imageSize={hook.imageSize}
								windowSize={hook.windowSize}
								imgUrl={hook.imgUrl}
								isLoading={hook.isLoading}
								isAvailable={isAvailable}
								inputImage={inputImageTarget}
								style={{
									maxHeight: `${
										((hook.windowSize.height < 800
											? 600
											: hook.windowSize.height) -
											120) *
										hook.zoomLevel
									}px`,
									maxWidth: "100%",
									objectFit: "contain",
								}}
							/>
						</Draggable>
					</Droppable>
				</div>
			</DndContext>
		</div>
	);
}
