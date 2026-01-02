"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Link from "next/link";
import { DraggableComponent } from "./dnd/draggable-component";
import { Droppable } from "./dnd/droppable";
import { useEffect, useState } from "react";
import { getWindowSize } from "./dnd/get-window-size";
import Image from "next/image";

export default function NotFound() {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
	const [itemOnePosition, setItemOnePosition] = useState({ x: 0, y: 0 });
	const [itemTwoPosition, setItemTwoPosition] = useState({ x: 0, y: 0 });
	const [itemThreePosition, setItemThreePosition] = useState({ x: 0, y: 0 });
	// const [isInitialized, setIsInitialized] = useState(false);
	const [isOnCanvas, setIsOnCanvas] = useState(true);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const windowSize = getWindowSize();
			const newWidth = windowSize.width;
			const newHeight = windowSize.height;
			setWindowSize({ width: newWidth, height: newHeight });
		}
	}, []);

	useEffect(() => {
		if (windowSize.width === 0 && windowSize.height === 0) return;
		setItemOnePosition({
			x: windowSize.width / 2 - 150,
			y: windowSize.height / 2,
		});
		setItemTwoPosition({
			x: windowSize.width / 2 - 50,
			y: windowSize.height / 2 - 100,
		});
		setItemThreePosition({
			x: windowSize.width / 2 + 50,
			y: windowSize.height / 2 - 200,
		});
	}, [windowSize]);

	function handleDragEnd(event: DragEndEvent): void {
		const { over, delta, active } = event;

		if (over && over.id === "canvas") {
			if (isOnCanvas) {
				// Move existing item on canvas
				if (active.id === "item-1") {
					setItemOnePosition((prev) => ({
						x: prev.x + delta.x,
						y: prev.y + delta.y,
					}));
				} else if (active.id === "item-2") {
					setItemTwoPosition((prev) => ({
						x: prev.x + delta.x,
						y: prev.y + delta.y,
					}));
				} else if (active.id === "item-3") {
					setItemThreePosition((prev) => ({
						x: prev.x + delta.x,
						y: prev.y + delta.y,
					}));
				}
			} else {
				// Place item from toolbar to canvas
				if (active.id === "item-1") {
					setItemOnePosition({
						x: delta.x, // Offset from drag start
						y: delta.y,
					});
				} else if (active.id === "item-2") {
					setItemTwoPosition({
						x: delta.x,
						y: delta.y,
					});
				} else if (active.id === "item-3") {
					setItemThreePosition({
						x: delta.x,
						y: delta.y,
					});
				}
				setIsOnCanvas(true);
			}
		}
	}

	const itemData = [
		{ id: "item-1", label: "4" },
		{ id: "item-2", label: "0" },
		{ id: "item-3", label: "4" },
	];

	return (
		<div className="relative">
			<DndContext onDragEnd={handleDragEnd}>
				<Droppable id="canvas" className="h-screen relative">
					{/* Grid pattern for visual reference */}
					{itemData.map((item, id) => (
						<DraggableComponent
							key={id}
							id={item.id}
							position={
								item.id === "item-1"
									? itemOnePosition
									: item.id === "item-2"
									? itemTwoPosition
									: itemThreePosition
							}
							windowSize={windowSize}
							className="text-8xl">
							<Image
								src={item.label === "4" ? "four.svg" : "zero.svg"}
								alt="404 Dot"
								width={100}
								height={100}
								className="w-24 h-24 md:w-32 md:h-32"
							/>
						</DraggableComponent>
					))}
					<h1 className="absolute bottom-40 left-1/2 -translate-x-1/2 text-4xl font-bold text-gray-400 select-none">
						Sorry This Page is Not Found
					</h1>
				</Droppable>
			</DndContext>
		</div>
	);
}
