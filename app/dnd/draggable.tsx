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
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id,
    });

    console.log('Draggable component rendered with position:', position, 'isDragging:', isDragging);
    console.log('Window Size:', windowSize);

    position = {
        x: position.x + 200 > windowSize.width ? windowSize.width - 200 : position.x - 170 < -170 ? -170 : position.x,
        y: position.y + 170 > windowSize.height ? windowSize.height - 200 : position.y - 100 < -100 ? -100 : position.y,
    }

    console.log('Adjusted position:', position);

    let style: React.CSSProperties
    if (!isAvailable) {
        style = {
            position: 'absolute',
            left: position.x,
            top: position.y,
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            zIndex: isDragging ? 1000 : 1,
        };
    } else {
        style = {
            position: 'relative',
            left: position.x - 250,
            top: position.y - 100,
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            zIndex: isDragging ? 1000 : 1,
        };
    }

    return (
        <div 
            ref={setNodeRef} 
            style={{
            ...style,
            width: isAvailable ? windowSize.width > 1000 ? windowSize.width / 2 : windowSize.width / 1.2 : '',
            }} 
            {...listeners} 
            {...attributes}
            className={`
            flex items-center justify-center relative rounded-lg font-medium text-slate-500
            bg-white from shadow-lg hover:shadow-xl active:scale-95
            cursor-grab active:cursor-grabbing select-none
            ${isDragging ? 'opacity-80 scale-110 rotate-2' : 'hover:scale-105'}
            ${isAvailable ? '' : 'w-96 h-56 px-6 py-3 border border-slate-100'}
            `}
        >
            {children}
        </div>
    );
}