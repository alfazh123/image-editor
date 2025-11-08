'use client';

import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";

import { Droppable } from "../dnd/droppable";
import { Draggable } from "../dnd/draggable";
import { getWindowSize } from "../dnd/get-window-size";
import { Input } from "@/components/ui/input";
import { Redo } from "lucide-react";
import {
	ColorTransfer,
	DisplaySize,
	AdjustColor,
	AdjustLight,
	DownloadImage,
	Sharp,
	BenchmarkMenu,
} from "../menu/menu";
import { getSizeNative, initActix, inputImage } from "../hooks/native/func";
import { useImageEditor } from "../hooks/useImageEditor";
import {
	AdjustColorProps,
	AdjustLightProps,
	BenchmarkTestProps,
} from "../menu/type";
import { InputBanner } from "@/components/input-banner";
import { ZoomControls } from "@/components/zoom-controls";
import { useBenchmarkHook } from "../hooks/useBenchmark";
import { useNativeHook } from "../hooks/useNativeEditor";
import { InitType } from "./type";
import { filterMenuItems } from "../data";
import { useRouter } from "next/navigation";

export default function Native() {
	const route = useRouter();

	// const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
	const [isOnCanvas, setIsOnCanvas] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
	const [isAvailable, setIsAvailable] = useState(false);

	const [isUpload, setIsUpload] = useState(false);

	const hook = useImageEditor();
	const benchmarkHook = useBenchmarkHook();
	const nativeHook = useNativeHook(hook, benchmarkHook);
	// const [welcomeOverlay, setWelcomeOverlay] = useState(true);

	const [actixInitialized, setActixInitialized] = useState<InitType>({
		success: false,
		error: null,
		message: null,
	});

	// Initialize WASM in useEffect
	useEffect(() => {
		async function initializeActix() {
			console.time("Actix initialization successful in");
			const init = await initActix();
			console.log("init", init);
			setActixInitialized(init);
			console.timeEnd("Actix initialization successful in");
			console.log(actixInitialized);
		}

		initializeActix();
	}, []);

	async function inputImageTarget(e: React.ChangeEvent<HTMLInputElement>) {
		if (!actixInitialized) {
			return;
		} else {
			setIsUpload(true);
			const { imgUrl, imgArr } = await inputImage(e);
			hook.setImgUrl(imgUrl);
			hook.setOriginalImgArr(imgArr);
			setIsAvailable(true);
			const fixSizeFile = new Blob([new Uint8Array(imgArr)], {
				type: "image/png",
			});
			const sizeImage = await getSizeNative(fixSizeFile);
			hook.setImageSize({ width: sizeImage.width, height: sizeImage.height });
			setIsUpload(false);
		}
	}

	async function inputImageReference(e: React.ChangeEvent<HTMLInputElement>) {
		if (!actixInitialized) {
			return;
		} else {
			const { imgUrl, imgArr } = await inputImage(e);
			hook.setImgRefUrl(imgUrl);
			const refImageFile = new Blob([new Uint8Array(imgArr)], {
				type: "image/png",
			});
			const sizeImage = await getSizeNative(refImageFile);
			hook.setRefSize({ width: sizeImage.width, height: sizeImage.height });
			hook.setRefImgArr(imgArr);
		}
	}

	// Function to process transfer color with WASM
	async function handleTransferColor() {
		nativeHook.transferColor(hook.refSize);
	}

	async function handleSharp(value: number[]) {
		nativeHook.sharp(value);
	}

	async function handleSaturation(value: number[]) {
		nativeHook.saturation(value);
	}

	async function handleTemperature(value: number[]) {
		nativeHook.temperature(value);
	}

	async function handleTint(value: number[]) {
		nativeHook.tint(value);
	}

	async function handleExposure(value: number[]) {
		nativeHook.exposure(value);
	}

	async function handleContrast(value: number[]) {
		nativeHook.contrast(value);
	}

	useEffect(() => {
		const handleResize = () => {
			if (typeof window !== "undefined") {
				const windowSize = getWindowSize();
				const newWidth = windowSize.width;
				const newHeight = windowSize.height;
				hook.setWindowSize({ width: newWidth, height: newHeight });
				setItemPosition({
					x: newWidth > 400 ? newWidth / 2.2 - 150 : 0,
					y: newWidth > 400 ? newHeight / 2.5 : newHeight / 2,
				});
				setIsInitialized(true);
			}
		};

		handleResize(); // Set initial size
		window.addEventListener("resize", handleResize);
		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isInitialized]);

	function closeWelcomeOverlay() {
		setTimeout(() => {
			hook.setWelcomeOverlay(false);
		}, 2000);
	}

	const colorItems: AdjustColorProps = {
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
					"bg-gradient-to-l from-green-400 via-slate-200 to-fuchsia-400",
			},
		],
	};

	const lightItems: AdjustLightProps = {
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

	filterMenuItems.map((item) => {
		nativeHook.filterMenuNative.push({
			name: item.label,
			onChangeFilter: async () => {
				const response = await fetch(item.imgUrl);
				const blob = await response.blob();
				const buffer = await blob.arrayBuffer();
				// hook.setRefSize({ width: item.width, height: item.height });
				// console.log(hook.refSize);
				nativeHook.functionFilterNative(new Uint8Array(buffer), {
					width: item.width,
					height: item.height,
				});
			},
			color: item.backgroundColor,
			backgroundImage: item.imgUrl || null,
		});
	});

	// Don't render until initialized
	if (!isInitialized) {
		return (
			<div className="h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	} else if (actixInitialized.error) {
		return (
			<div className="h-screen flex items-center justify-center">
				Actix initialization failed
			</div>
		);
	}

	function submitBenchmark() {
		localStorage.removeItem("benchmarkNative");
		const ct = localStorage.getItem("transferColorAttemp");
		const ctJSON = ct ? JSON.parse(ct) : [];
		const ctFiltered = ctJSON.filter(
			(item: { type: string }) => item.type === "WASM"
		);
		const updatedCT = [...ctFiltered, ...benchmarkHook.transferColorAttemp];

		localStorage.setItem("transferColorAttemp", JSON.stringify(updatedCT));
		localStorage.setItem(
			"benchmarkNative",
			JSON.stringify(benchmarkHook.benchmarkNative)
		);
		route.push("/benchmark-result");
	}

	const type = "native";

	const benchmarkProps: BenchmarkTestProps = {
		runSpeedTest: benchmarkHook.runSpeedTest,
		isLoading: benchmarkHook.isLoading,
		isFinished: benchmarkHook.isFinished,
		resultSpeed: benchmarkHook.resultSpeed,
		error: benchmarkHook.error,
		windowSize: hook.windowSize,
		testAttempts: benchmarkHook.testAttempts,
		// testAttemptsLatency: benchmarkHook.testAttemptsLatency,
		type: type, // Explicitly set as string literal type
		submitResult: submitBenchmark,
		startBenchmark: benchmarkHook.startBenchmark,
		useLatency: benchmarkHook.useLatency,
		changeUseLatency: benchmarkHook.changeUseLatency,
		setStartBenchmark: benchmarkHook.setStartBenchmark,
	};

	return (
		<div
			className="h-screen bg-gradient-to-br from-gray-50 to-blue-50"
			onWheel={
				isAvailable ? (e) => hook.handleOnWheel(e.nativeEvent) : () => {}
			}>
			<DndContext onDragStart={closeWelcomeOverlay} onDragEnd={handleDragEnd}>
				{/* Toolbar */}
				{hook.imgUrl && (
					<div className="fixed flex flex-col items-center md:top-4 md:right-50 md:left-50 md:bottom-auto bottom-4 left-0 right-0 z-50 rounded-md justify-center">
						<nav className="flex items-center z-50 bg-gray-200/40 backdrop-blur-3xl shadow-lg md:w-fit w-full md:m-4 rounded-md md:justify-center justify-between overflow-x-scroll scrollbar-hide">
							<div className="flex w-full md:h-10 h-14">
								<ColorTransfer
									onClick={handleTransferColor}
									onChange={inputImageReference}
									imgRefUrl={hook.imgRefUrl}
									menuFilter={nativeHook.filterMenuNative}
								/>

								<Sharp
									value={hook.sharpVal}
									id="sharp-slider"
									onChange={handleSharp}
									windowSize={hook.windowSize}
								/>

								<AdjustColor colorItem={colorItems.colorItem} />

								<AdjustLight lightItem={lightItems.lightItem} />

								<DisplaySize
									width={hook.imageSize.width}
									height={hook.imageSize.height}
								/>

								<BenchmarkMenu {...benchmarkProps} />

								<DownloadImage url={hook.imgUrl} />
							</div>
						</nav>
					</div>
				)}
				{hook.imgUrl && (
					<div className="fixed md:block hidden bottom-10 right-10 z-50">
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
							<div className="flex flex-col justify-center h-45 items-center z-100 mt-40">
								<h1 className="text-2xl font-bold text-gray-600 mb-4">
									This page use Actix web for image processing.
								</h1>

								{!actixInitialized.success ? (
									<div className="text-red-500 mb-4">
										{actixInitialized.error ||
											"Failed to connect to Actix server"}
									</div>
								) : (
									<div className="text-green-500 mb-4">
										{actixInitialized.message || "Unknown error"}
									</div>
								)}
							</div>
						)}

						<Input
							id="image-upload"
							type="file"
							accept="image/*"
							onChange={(e) => inputImageTarget(e)}
							className={`hidden`}
						/>
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
								isUploadImage={isUpload}
								style={{
									maxHeight: `${
										((hook.windowSize.height < 800
											? 600
											: hook.windowSize.height) -
											120) *
										hook.zoomLevel
									}px`,
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

