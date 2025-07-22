import React from 'react';
import {useDraggable} from '@dnd-kit/core';

interface DraggableProps {
    id: string;
    children: React.ReactNode;
    isAvailable?: boolean;
    windowSize: { width: number; height: number };
    position?: { x: number; y: number };
}

export function Draggable({ id, children, isAvailable, windowSize, position = { x: 0, y: 0 } }: DraggableProps): React.ReactElement {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
		});

	position = {
		x:
			position.x + 20 > windowSize.width
				? windowSize.width - 10
				: position.x + 300 < 0
				? -100
				: position.x,
		y:
			position.y + 20 > windowSize.height
				? windowSize.height - 10
				: position.y + 100 < 0
				? -10
				: position.y,
	};

	let style: React.CSSProperties;
	if (!isAvailable) {
		style = {
			position: "absolute",
			left: position.x,
			top: position.y,
			transform: transform
				? `translate3d(${transform.x}px, ${transform.y}px, 0)`
				: undefined,
			zIndex: isDragging ? 1000 : 1,
		};
	} else {
		style = {
			position: "relative",
			left: position.x,
			top: position.y,
			transform: transform
				? `translate3d(${transform.x}px, ${transform.y}px, 0)`
				: undefined,
			zIndex: isDragging ? 1000 : 1,
		};
	}

	return (
		<div
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
            bg-white from shadow-lg hover:shadow-xl active:scale-95
            cursor-grab active:cursor-grabbing select-none
			${isDragging ? "opacity-80 scale-110 rotate-2" : "hover:scale-105"}
            ${isAvailable ? "" : "w-96 h-56 px-6 py-3 border border-slate-100"}
            `}>
			{children}
		</div>
	);
}