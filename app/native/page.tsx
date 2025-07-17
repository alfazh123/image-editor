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

interface InitType {
	success: boolean;
	error?: string | null;
	message?: string | null;
}

interface LightValueProps {
	exposureValue: number;
	contrastValue: number;
}

interface ColorValueProps {
	saturationValue: number;
	temperatureValue: number;
	tintValue: number;
}

export default function Native() {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
	const [isOnCanvas, setIsOnCanvas] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
	const [isAvailable, setIsAvailable] = useState(false);

	const [imgUrl, setImgUrl] = useState<string | null>(null);
	const [imgRefUrl, setImgRefUrl] = useState<string | null>(null);
	// const [editImgArr, setEditImgArr] = useState<Uint8Array>(new Uint8Array());
	const [originalImgArr, setOriginalImgArr] = useState<Uint8Array>(
		new Uint8Array()
	);
	const [refImgArr, setRefImgArr] = useState<Uint8Array>(new Uint8Array());
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
	const [isLoading, setIsLoading] = useState(false);

	// tools value set (color and light)
	const [lightVal, setLightVal] = useState<LightValueProps>({
		exposureValue: 0,
		contrastValue: 0,
	});
	const [colorVal, setColorVal] = useState<ColorValueProps>({
		saturationValue: 0,
		temperatureValue: 0,
		tintValue: 0,
	});

	const [actixInitialized, setActixInitialized] = useState<InitType>({
		success: false,
		error: null,
		message: null,
	});

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
				setImgUrl(ArrToURL(fixSizeArr));
				setIsLoading(false);
				setIsAvailable(true);
				// setEditImgArr(fixSizeArr); // Store original image data
				setOriginalImgArr(fixSizeArr); // Store original image data

				const fixSizeFile = new Blob([fixSizeArr], { type: "image/png" });
				const sizeImage = await getSizeNative(fixSizeFile);
				setImageSize({ width: sizeImage.width, height: sizeImage.height });
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
				setRefImgArr(fixSizeImg); // Store reference image data
				setImgRefUrl(imageRefUrl);
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
			new Blob([originalImgArr], { type: "image/png" }),
			new Blob([refImgArr], { type: "image/png" })
		);
		setImgUrl(ArrToURL(resultArr));
		setIsLoading(false);
		// setEditImgArr(resultArr); // Store original image data
		setOriginalImgArr(resultArr); // Store original image data
		console.timeEnd("Transfer color native completed in");
	}

	async function handleSaturation(value: number[]) {
		// console.time('Adjust Saturation Native finish in');
		setColorVal((prev) => ({
			...prev,
			saturationValue: value[0],
		}));

		const blob = new Blob([originalImgArr], { type: "image/png" });
		const result = await handleSaturationNative(blob, colorVal.saturationValue);
		// setEditImgArr(result);
		setImgUrl(ArrToURL(result));
		// console.timeEnd('Adjust Saturation Native finish in');
	}

	async function handleTemperature(value: number[]) {
		console.time("Adjust Temperature Native finish in");
		setColorVal((prev) => ({
			...prev,
			temperatureValue: value[0],
		}));
		console.log("Temperature value:", value[0]);
		const blob = new Blob([originalImgArr], { type: "image/png" });
		const result = await handleTemperatureNative(
			blob,
			colorVal.temperatureValue
		);
		// setEditImgArr(result);
		setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Temperature Native finish in");
	}

	async function handleTint(value: number[]) {
		console.time("Adjust Tint Native finish in");
		setColorVal((prev) => ({
			...prev,
			tintValue: value[0],
		}));

		const blob = new Blob([originalImgArr], { type: "image/png" });
		const result = await handleTintNative(blob, colorVal.tintValue);
		// setEditImgArr(result);
		setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	}

	async function handleExposure(value: number[]) {
		console.time("Adjust Tint Native finish in");
		setLightVal((prev) => ({
			...prev,
			exposureValue: value[0],
		}));

		const blob = new Blob([originalImgArr], { type: "image/png" });
		const result = await handleExposureNative(blob, lightVal.exposureValue);
		// setEditImgArr(result);
		setImgUrl(ArrToURL(result));
		console.timeEnd("Adjust Tint Native finish in");
	}

	async function handleContrast(value: number[]) {
		console.time("Adjust Tint Native finish in");
		setLightVal((prev) => ({
			...prev,
			contrastValue: value[0],
		}));

		const blob = new Blob([originalImgArr], { type: "image/png" });
		const result = await handleContrastsNative(blob, lightVal.contrastValue);
		// setEditImgArr(result);
		setImgUrl(ArrToURL(result));
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

	return (
		<div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			<DndContext onDragEnd={handleDragEnd}>
				{/* Toolbar */}
				{imgUrl && (
					<nav className="fixed flex items-center top-50 bottom-50 right-0 z-50 bg-white shadow-lg border-b w-16 m-4 rounded-2xl justify-center">
						<div className="flex flex-col max-w-7xl mx-auto p-4">
							{/* Transfer Color Tool */}
							<div className="flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
								<ColorTransfer
									onClick={handleTransferColor}
									onChange={inputRefImage}
									imgRefUrl={imgRefUrl}
								/>
							</div>

							<div className="flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
								<Tools
									saturationValue={colorVal.saturationValue}
									onChangeSaturation={handleSaturation}
									temperatureValue={colorVal.temperatureValue}
									onChangeTemperature={handleTemperature}
									tintValue={colorVal.tintValue}
									onChangeTint={handleTint}
									exposureValue={lightVal.exposureValue}
									onChangeExposure={handleExposure}
									contrastValue={lightVal.contrastValue}
									onChangeContrast={handleContrast}
								/>
							</div>

							<div className="flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
								<DisplaySize
									width={imageSize.width}
									height={imageSize.height}
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

						{!imgUrl && (
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
							{imgUrl && (
								<div
									className={`relative flex items-center justify-center w-full`}>
									<Image
										id="image-item"
										src={imgUrl}
										alt="Image"
										width={imageSize.width}
										height={imageSize.height}
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
