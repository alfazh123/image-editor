import React from 'react';
import {useDraggable} from '@dnd-kit/core';

interface DraggableProps {
	id: string;
	children: React.ReactNode;
	isAvailable?: boolean;
	windowSize: { width: number; height: number };
	position?: { x: number; y: number };
}

export function Draggable({
	id,
	children,
	isAvailable,
	windowSize,
	position = { x: 0, y: 0 },
}: DraggableProps): React.ReactElement {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
		});

	const draggableItem = document.getElementById(id);
	const draggableWidth = draggableItem?.clientWidth || 0;
	const draggableHeight = draggableItem?.clientHeight || 0;

	position = {
		x:
			position.x > windowSize.width
				? windowSize.width + 150
				: position.x + draggableWidth < 10
				? position.x + 100
				: position.x,
		y:
			position.y > windowSize.height
				? windowSize.height - 150
				: position.y + draggableHeight < 10
				? position.y + 100
				: position.y,
	};

	console.log(windowSize.width);

	const style: React.CSSProperties = {
		position: `${isAvailable ? "relative" : "absolute"}`,
		left: position.x,
		top: position.y,
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		zIndex: 1,
	};

	return (
		<div
			id={id}
			ref={setNodeRef}
			style={{
				...style,
				width: isAvailable ? "fit-content" : "",
				touchAction: "none",
			}}
			{...listeners}
			{...attributes}
			className={`
            flex items-center justify-center relative rounded-lg font-medium text-slate-500
            bg-transparent backdrop-blur-lg from shadow-lg hover:shadow-xl active:scale-95
            cursor-grab active:cursor-grabbing select-none
			${isDragging ? "scale-110 rotate-2" : "hover:scale-105"}
            ${isAvailable ? "" : "w-96 h-56 px-6 py-3 border border-slate-100"}
            `}>
			{children}
		</div>
	);
}