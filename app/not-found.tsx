"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Link from "next/link";
import { DraggableComponent } from "./dnd/draggable-component";
import { Droppable } from "./dnd/droppable";
import { useEffect, useRef, useState } from "react";
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
			x: windowSize.width / 2 - 250,
			y: windowSize.height / 2 - 200,
		});
		setItemTwoPosition({
			x: windowSize.width / 2 - 50,
			y: windowSize.height / 2 - 100,
		});
		setItemThreePosition({
			x: windowSize.width / 2 + 180,
			y: windowSize.height / 2 + 30,
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
		{ id: "item-1", label: "4", src: "four-left.svg", className: "-rotate-12" },
		{ id: "item-2", label: "0", src: "zero.svg", className: "rotate-6" },
		{
			id: "item-3",
			label: "4",
			src: "four-right.svg",
			className: "rotate-12",
		},
	];

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	// Gunakan Ref untuk posisi, bukan State, agar sinkron dengan frame rate
	const mousePos = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			// Beri warna dasar saat resize agar tidak putih
			// ctx.fillStyle = "#d1e0d1";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		};

		const handleMouseMove = (e: MouseEvent) => {
			mousePos.current.prevX = mousePos.current.x;
			mousePos.current.prevY = mousePos.current.y;
			mousePos.current.x = e.clientX;
			mousePos.current.y = e.clientY;
		};

		const draw = () => {
			// 1. Efek Trail (memudar)
			ctx.fillStyle = "rgba(255, 255, 255, 0.1)"; // Sesuaikan dengan warna bg
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// 2. Gambar Bulatan (Cursor)
			ctx.beginPath();
			ctx.arc(mousePos.current.x, mousePos.current.y, 8, 0, Math.PI * 2);
			ctx.fillStyle = "#6CBBFB";
			ctx.fill();

			// 3. Opsi: Gambar Garis Tekstur (seperti video pertama)
			ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(mousePos.current.prevX, mousePos.current.prevY);
			// ctx.lineTo(mousePos.current.x, mousePos.current.y);
			ctx.stroke();

			animationFrameId = requestAnimationFrame(draw);
		};

		window.addEventListener("resize", resizeCanvas);
		window.addEventListener("mousemove", handleMouseMove);

		resizeCanvas();
		draw();

		// Cleanup saat komponen unmount
		return () => {
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<div className="relative">
			<DndContext onDragEnd={handleDragEnd}>
				<Droppable
					id="canvas"
					className="h-screen relative bg-radial from-gray-500 via-gray-700 to-gray-900 overflow-hidden">
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
								src={item.src}
								alt="404 Dot"
								width={100}
								height={100}
								className={`w-24 h-24 md:w-32 md:h-32 ${item.className}`}
							/>
						</DraggableComponent>
					))}
					<h1 className="absolute z-10 bottom-40 left-1/2 -translate-x-1/2 text-4xl font-bold text-gray-400 select-none">
						Sorry This Page is Not Found
					</h1>
					<canvas
						ref={canvasRef}
						className="absolute inset-0 w-full h-full pointer-events-none bg-radial from-gray-500 via-gray-700 to-gray-900 overflow-hidden"
					/>
				</Droppable>
			</DndContext>
		</div>
	);
}
