import React from 'react';
import {useDroppable} from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
}

export function Droppable({ id, children, className = '' }: DroppableProps) {
  const { setNodeRef } = useDroppable({
		id,
	});

	return (
		<div
			ref={setNodeRef}
			className={`
        relative w-full h-full
        transition-all ease-in-out
        overflow-hidden
        ${className}
      `}>
			{children}
		</div>
	);
}