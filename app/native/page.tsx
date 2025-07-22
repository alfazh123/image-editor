'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {DndContext} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import {Droppable} from '../dnd/droppable';
import {Draggable} from '../dnd/draggable';
import { getWindowSize } from '../dnd/get-window-size';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { fixSize } from "../wasm/func";
import { ColorTransfer, DisplaySize, Tools } from "../menu/menu";
import init from "rust-editor";
import {
	fixSizeNative,
	getSizeNative,
	handleContrastsNative,
	handleExposureNative,
	handleSaturationNative,
	handleTemperatureNative,
	handleTintNative,
	swithColorNative,
} from "./func";
import { useImageEditor } from "../hooks/useImageEditor";
import { ToolsProps } from "../menu/type";

interface InitType {
	success: boolean;
	error?: string | null;
	message?: string | null;
}

export default function Native() {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
	const [isOnCanvas, setIsOnCanvas] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
	const [isAvailable, setIsAvailable] = useState(false);

	// const [hook.imgUrl, hook.setImgUrl] = useState<string | null>(null);
	// const [imgRefUrl, setImgRefUrl] = useState<string | null>(null);
	// const [editImgArr, setEditImgArr] = useState<Uint8Array>(new Uint8Array());
	// const [hook.originalImgArr, setOriginalImgArr] = useState<Uint8Array>(
	// new hook.hook.Uint8Array()
	// );
	// const [refImgArr, hook.setRefImgArr] = useState<Uint8Array>(new Uint8Array());
	// const [imageSize, hook.hook.setImageSize] = useState({ width: 0, height: 0 });
	const [isLoading, setIsLoading] = useState(false);
	// tools value set (color and light)
	// const [lightVal, hook.setLightVal] = useState<LightValueProps>({
	// 	exposureValue: 0,
	// 	contrastValue: 0,
	// });
	// const [hook.colorVal, hook.setColorVal] = useState<ColorValueProps>({
	// 	saturationValue: 0,
	// 	temperatureValue: 0,
	// 	tintValue: 0,
	// });

	const [actixInitialized, setActixInitialized] = useState<InitType>({
		success: false,
		error: null,
		message: null,
	});

	const hook = useImageEditor();

	// Initialize WASM in useEffect
	useEffect(() => {
		init()
			.then(() => {
				console.log("WASM initialized successfully");
				setIsInitialized(true);
			})
			.catch((error) => {
				console.error("Failed to initialize WASM:", error);
				setActixInitialized({
					success: false,
					error: "Failed to initialize WASM",
					message: null,
				});
			});
		async function initializeActix() {
			fetch("http://192.168.10.99:8080/")
				.then(async (response) => {
					if (response.ok) {
						const json = await response.json();
						console.log("JSON:", json);
						setActixInitialized({
							success: true,
							error: null,
							message: json.message,
						});
					} else {
						setActixInitialized({
							success: false,
							error: response.statusText,
							message: "Error",
						});
						console.error(
							"Failed to connect to Actix server:",
							response.statusText
						);
					}
				})
				.catch((error) => {
					setActixInitialized({
						success: false,
						error: "Unknown error",
						message: null,
					});
					console.error("Error connecting to Actix server:", error);
				});
		}

		initializeActix();
	}, []);

	async function inputImage(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async () => {
				const fixSizeArr = await fixSizeNative(file);
				hook.setImgUrl(ArrToURL(fixSizeArr));
				setIsLoading(false);
				setIsAvailable(true);
				// setEditImgArr(fixSizeArr); // Store original image data
				hook.setOriginalImgArr(fixSizeArr); // Store original image data

				const fixSizeFile = new Blob([fixSizeArr], { type: "image/png" });
				const sizeImage = await getSizeNative(fixSizeFile);
				hook.setImageSize({ width: sizeImage.width, height: sizeImage.height });
			};
			reader.readAsDataURL(file);
		}
	}

	function inputRefImage(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async () => {
				const fixSizeImg = await fixSize(
					new Uint8Array(await file.arrayBuffer())
				);
				const imageRefUrl = URL.createObjectURL(
					new Blob([fixSizeImg], { type: "image/png" })
				);
				hook.setRefImgArr(fixSizeImg); // Store reference image data
				hook.setImgRefUrl(imageRefUrl);
			};
			reader.readAsDataURL(file);
		}
	}

	function ArrToURL(arr: Uint8Array): string {
		const blob = new Blob([arr], { type: "image/png" });
		return URL.createObjectURL(blob);
	}

	// Function to process transfer color with WASM
	async function handleTransferColor() {
		console.time("Transfer color native completed in");
		setIsLoading(true);
		const resultArr = await swithColorNative(
			new Blob([hook.originalImgArr], { type: "image/png" }),
			new Blob([hook.refImgArr], { type: "image/png" })
		);
		hook.setImgUrl(ArrToURL(resultArr));
		setIsLoading(false);
		// setEditImgArr(resultArr); // Store original image data
		hook.setOriginalImgArr(resultArr); // Store original image data
		console.timeEnd("Transfer color native completed in");
	}

	async function handleSaturation(value: number[]) {
		// console.time('Adjust Saturation Native finish in');
		hook.setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));

		const blob = new Blob([hook.originalImgArr], { type: "image/png" });
		const result = await handleSaturationNative(
			blob,
			hook.colorVal.saturationValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Saturation Native finish in");
	}

	async function handleTemperature(value: number[]) {
		console.time("Adjust Temperature Native finish in");
		hook.setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		console.log("Temperature value:", value[0]);
		const blob = new Blob([hook.originalImgArr], { type: "image/png" });
		const result = await handleTemperatureNative(
			blob,
			hook.colorVal.temperatureValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(hook.ArrToURL(result));
		console.timeEnd("Adjust Temperature Native finish in");
	}

	async function handleTint(value: number[]) {
		console.time("Adjust Tint Native finish in");
		hook.setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));

		const blob = new Blob([hook.originalImgArr], { type: "image/png" });
		const result = await handleTintNative(blob, hook.colorVal.tintValue);
		// setEditImgArr(result);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	}

	async function handleExposure(value: number[]) {
		console.time("Adjust Tint Native finish in");
		hook.setLightVal((prev) => ({
			...prev,
			exposureValue: value[0],
		}));

		const blob = new Blob([hook.originalImgArr], { type: "image/png" });
		const result = await handleExposureNative(
			blob,
			hook.lightVal.exposureValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	}

	async function handleContrast(value: number[]) {
		console.time("Adjust Tint Native finish in");
		hook.setLightVal((prev) => ({
			...prev,
			contrastValue: value[0],
		}));

		const blob = new Blob([hook.originalImgArr], { type: "image/png" });
		const result = await handleContrastsNative(
			blob,
			hook.lightVal.contrastValue
		);
		// setEditImgArr(result);
		hook.setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	}

	useEffect(() => {
		const handleResize = () => {
			if (typeof window !== "undefined") {
				const windowSize = getWindowSize();
				const newWidth = windowSize.width;
				const newHeight = windowSize.height;
				setWindowSize({ width: newWidth, height: newHeight });

				// Only set initial position once
				if (!isInitialized) {
					setItemPosition({ x: newWidth / 2.2, y: newHeight / 2.5 });
					setIsInitialized(true);
				}
			}
		};

		handleResize(); // Set initial size
	}, [isInitialized]);

	// Don't render until initialized
	if (!isInitialized) {
		return (
			<div className="h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	const toolsItems: ToolsProps = {
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
			<DndContext onDragEnd={handleDragEnd}>
				{/* Toolbar */}
				{hook.imgUrl && (
					<nav className="fixed flex items-center top-50 bottom-50 right-0 z-50 bg-white shadow-lg border-b w-16 m-4 rounded-2xl justify-center">
						<div className="flex flex-col max-w-7xl mx-auto p-4">
							{/* Transfer Color Tool */}
							<div className="flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
								<ColorTransfer
									onClick={handleTransferColor}
									onChange={inputRefImage}
									imgRefUrl={hook.imgRefUrl}
								/>
							</div>

							<div className="flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
								<Tools
									colorItem={toolsItems.colorItem}
									lightItem={toolsItems.lightItem}
								/>
							</div>

							<div className="flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
								<DisplaySize
									width={hook.imageSize.width}
									height={hook.imageSize.height}
								/>
							</div>
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
							<div className="flex flex-col justify-center h-45 items-center z-100 mt-40">
								<h1 className="text-2xl font-bold text-gray-600 mb-4">
									This page use WASM for image processing.
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
							onChange={(e) => inputImage(e)}
							className={`hidden`}
						/>

						<Draggable
							id="single-item"
							position={itemPosition}
							windowSize={windowSize}
							isAvailable={isAvailable}>
							{/* <input type="file" accept='image/*' onChange={(e) => inputImage(e)} className={`${isAvailable ? 'hidden' : ''}`} /> */}
							<Label
								className={`${
									isAvailable ? "hidden" : ""
								} text-sm text-gray-600 border-2 border-dashed border-slate-300 p-2 rounded-sm`}
								htmlFor="image-upload">
								<Plus className="inline mr-1" />
								Upload Image
							</Label>
							{hook.imgUrl && (
								<div
									className={`relative flex items-center justify-center w-full`}>
									<Image
										id="image-item"
										src={hook.imgUrl}
										alt="Image"
										width={hook.imageSize.width}
										height={hook.imageSize.height}
										className="w-auto h-full max-h-full"
										priority
										draggable="false"
										style={{
											objectFit: "contain",
											maxHeight: `${windowSize.height - 120}px`,
											maxWidth: "100%",
										}}
									/>
									<div>
										{isLoading && (
											<div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white opacity-15 text-black">
												Loading...
											</div>
										)}
									</div>
								</div>
							)}
						</Draggable>
					</Droppable>
				</div>
			</DndContext>
		</div>
	);

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
}

