import React from 'react';
import {useDraggable} from '@dnd-kit/core';

interface DraggableProps {
    id: string;
    children: React.ReactNode;
    windowSize: { width: number; height: number };
    position?: { x: number; y: number };
    className?: string;
}

export function DraggableComponent({ id, children, windowSize, position = { x: 0, y: 0 }, className }: DraggableProps): React.ReactElement {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id,
    });

    position = {
        x: position.x + 200 > windowSize.width ? windowSize.width - 200 : position.x - 170 < -170 ? -170 : position.x,
        y: position.y + 170 > windowSize.height ? windowSize.height - 200 : position.y - 100 < -100 ? -100 : position.y,
    }

    const style: React.CSSProperties = {
			position: "absolute",
			left: position.x,
			top: position.y,
			transform: transform
				? `translate3d(${transform.x}px, ${transform.y}px, 0)`
				: undefined,
			zIndex: isDragging ? 1000 : 1,
		};

    return (
        <div 
            ref={setNodeRef} 
            style={{
            ...style,
            }} 
            {...listeners} 
            {...attributes}
            className={`
            flex items-center justify-center relative rounded-lg font-medium text-slate-500
            bg-transparent active:scale-95
            cursor-grab active:cursor-grabbing select-none
            w-fit
            ${className}
            `}
            // ${isDragging ? 'opacity-80 scale-110 rotate-2' : 'hover:scale-105'}
        >
            {children}
        </div>
    );
}