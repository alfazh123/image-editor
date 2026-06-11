'use client';

import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";

import { Droppable } from "../dnd/droppable";
import { Draggable } from "../dnd/draggable";

import {
	ColorTransfer,
	DisplaySize,
	DownloadImage,
	Sharp,
	AdjustColor,
	AdjustLight,
} from "../menu/menu";
import { StatusBanner } from "@/components/status-banner";
import { InputBanner } from "@/components/input-banner";

import { filterMenuItems } from "../data";

import { AdjustColorProps, AdjustLightProps } from "../menu/type";
import { useImageEditor, useZoom } from "../hooks/useImageEditor";
import { ZoomControls } from "@/components/zoom-controls";
import { useInitWasm, useWasmHook } from "../hooks/useWasmEditor";
import { toast } from "sonner";

import { useLightProcessing } from "../hooks/useLightProcess";
import { useSharpPRocess } from "../hooks/useSharpProcess";
import { useColorProcessing } from "../hooks/useColorProcess";
import { useHandleSlider } from "../hooks/useHandleSlider";
import { useSetUpPosition } from "../hooks/useSetupPosition";
import { useInputImage } from "../hooks/useInputImage";
import WelcomeOverlay from "@/components/welcom-overlay";
import BackgroundCanvas from "@/components/background-canvas";
import MenuGroup from "../menu/menu-group";

export default function Wasm() {
	const [isAvailable, setIsAvailable] = useState(false);

	const [selectedMenu, setSelectedMenu] = useState<string>("");
	const handleMenuClick = (id: string) => {
		setSelectedMenu((prev) => (prev === id ? "" : id));
	};

	const hook = useImageEditor();
	const lightHook = useLightProcessing();
	const colorHook = useColorProcessing();
	const sharpHook = useSharpPRocess();
	const wasmHooks = useWasmHook(hook, sharpHook, lightHook, colorHook);

	const { zoomLevel, handleZoomReset, handleZoomChange, handleOnWheel } =
		useZoom();

	const {
		handleSharpChange,
		handleSaturation,
		handleTemperature,
		handleTint,
		handleExposure,
		handleContrast,
		handleTransferColor,
	} = useHandleSlider(wasmHooks);

	const { itemPosition, handleDragEnd, isInitialized } = useSetUpPosition(hook);

	const initWasm = useInitWasm();

	const { inputImageTarget, inputRefImage } = useInputImage(
		hook,
		initWasm,
		setIsAvailable,
	);

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

	function closeWelcomeOverlay() {
		setTimeout(() => {
			hook.setWelcomeOverlay(false);
		}, 2000);
	}

	const color: AdjustColorProps = {
		id: "ac",
		colorItem: [
			{
				title: "Saturation",
				value: colorHook.colorVal.saturationValue,
				id: "saturation-slider",
				onChange: handleSaturation,
				className: "bg-slate-200",
			},
			{
				title: "Temperature",
				value: colorHook.colorVal.temperatureValue,
				id: "temperature-slider",
				onChange: handleTemperature,
				className: "bg-gradient-to-r from-blue-400 via-slate-200 to-yellow-200",
			},
			{
				title: "Tint",
				value: colorHook.colorVal.tintValue,
				id: "tint-slider",
				onChange: handleTint,
				className:
					"bg-gradient-to-l from-green-400 via-slate-200 to-fuchsia-400",
			},
		],
		selectedId: selectedMenu,
	};

	const light: AdjustLightProps = {
		id: "al",
		lightItem: [
			{
				title: "Exposure",
				value: lightHook.lightVal.exposureValue,
				id: "exposure-slider",
				onChange: handleExposure,
			},
			{
				title: "Contrast",
				value: lightHook.lightVal.contrastValue,
				id: "contrast-slider",
				onChange: handleContrast,
			},
		],
		selectedId: selectedMenu,
	};

	if (!isInitialized) {
		return (
			<div className="h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	return (
		<div
			className="h-screen bg-gradient-to-br from-gray-50 to-blue-50"
			onWheel={isAvailable ? (e) => handleOnWheel(e.nativeEvent) : () => {}}>
			<DndContext
				onDragStart={closeWelcomeOverlay} // Hide overlay when drag starts
				onDragEnd={handleDragEnd}>
				<div
					className={`fixed ${hook.imgUrl ? "flex" : "hidden"} flex-col items-center md:top-4 md:right-50 md:left-50 md:bottom-auto bottom-4 left-0 right-0 z-50 rounded-md justify-center`}>
					<MenuGroup
						handleMenuClick={handleMenuClick}
						selectedMenu={selectedMenu}>
						<ColorTransfer
							id="tc"
							onClick={handleTransferColor}
							onChange={inputRefImage}
							imgRefUrl={hook.imgRefUrl}
							menuFilter={wasmHooks.filterMenu}
							selectedId={selectedMenu}
						/>
						<Sharp
							value={sharpHook.sharpVal}
							id="sh"
							onChange={handleSharpChange}
							selectedId={selectedMenu}
						/>
						<AdjustColor
							id={color.id}
							colorItem={color.colorItem}
							selectedId={selectedMenu}
						/>
						<AdjustLight
							id={light.id}
							lightItem={light.lightItem}
							selectedId={selectedMenu}
						/>
						<DisplaySize
							id="sz"
							width={hook.imageSize.width}
							height={hook.imageSize.height}
							selectedId={selectedMenu}
						/>
						<DownloadImage
							id="dl"
							url={hook.imgUrl || ""}
							selectedId={selectedMenu}
						/>
					</MenuGroup>
				</div>
				{hook.imgUrl && (
					<ZoomControls
						zoomLevel={zoomLevel}
						onZoomReset={handleZoomReset}
						onZoomChange={handleZoomChange}
					/>
				)}

				{/* Canvas Area */}
				<Droppable id="canvas" className="h-screen relative">
					<BackgroundCanvas zoomLevel={zoomLevel} />

					{!hook.imgUrl && (
						<StatusBanner
							title="This page use WASM for image processing."
							initialized={initWasm.wasmInitialized}
							error={initWasm.wasmError}
						/>
					)}

					<Draggable
						id="single-item"
						position={itemPosition}
						windowSize={hook.windowSize}
						isAvailable={isAvailable}>
						{hook.welcomeOverlay && !isAvailable && (
							<WelcomeOverlay
								welcomeOverlay={hook.welcomeOverlay}
								imgUrl={hook.imgUrl}
							/>
						)}
						<InputBanner
							imageSize={hook.imageSize}
							windowSize={hook.windowSize}
							imgUrl={hook.imgUrl}
							isLoading={hook.isLoading}
							isAvailable={isAvailable}
							inputImage={inputImageTarget}
							style={{
								height: `${
									((hook.windowSize.height < 800
										? 600
										: hook.windowSize.height) -
										120) *
									zoomLevel
								}px`,
								objectFit: "contain",
							}}
						/>
					</Draggable>
				</Droppable>
			</DndContext>
		</div>
	);
}
