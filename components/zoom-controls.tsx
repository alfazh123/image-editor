"use client";

import React, { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { SliderZoom } from "@/app/menu/menu-item";
import { Button } from "@/components/ui/button";
import TooltipComponent from "./tooltip-component";

interface ZoomControlsProps {
	zoomLevel: number;
	onZoomReset: () => void;
	onZoomChange: (value: number[]) => void;
	windowSize?: { width: number; height: number };
}

export function ZoomControls({
	zoomLevel,
	onZoomReset,
	onZoomChange,
}: ZoomControlsProps) {
	useEffect(() => {
		if (!window) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === "0") {
				e.preventDefault();
				onZoomReset();
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [zoomLevel]);

	return (
		<div className="fixed md:block hidden bottom-10 right-10 z-50">
			<div className="z-50 bg-stone-100 rounded-lg shadow-lg p-2 md:w-14 w-full items-center">
				<div className="flex md:flex-col space-y-2">
					<TooltipComponent text="Rest Zoom (Ctrl + '0')">
						<Button
							onClick={onZoomReset}
							className="p-2 rounded transition-colors text-xs flex justify-center"
							title="Reset Zoom (Ctrl + '0')">
							<RotateCcw size={14} />
						</Button>
					</TooltipComponent>
					<SliderZoom
						value={Math.round(zoomLevel * 100)}
						onChange={(value: number[]) => {
							if (zoomLevel) {
								onZoomChange(value);
							}
						}}
						id="zoom-slider"
						className="bg-gray-300"
					/>
				</div>
			</div>
		</div>
	);
}
