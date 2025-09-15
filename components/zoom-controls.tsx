import React from 'react';
import { RotateCcw } from 'lucide-react';
import { SliderZoom } from '@/app/menu/menu-item';
import { Button } from '@/components/ui/button';

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
	return (
		<div className="z-50 bg-transparent backdrop-blur-xl rounded-lg shadow-lg p-2 md:w-14 w-full items-center">
			<div className="flex md:flex-col space-y-2">
				<Button
					onClick={onZoomReset}
					className="p-2 rounded transition-colors text-xs flex justify-center"
					title="Reset Zoom (Ctrl + '0')">
					<RotateCcw size={14} />
				</Button>
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
	);
}