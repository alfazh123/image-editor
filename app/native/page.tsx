'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {DndContext} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';

import {Droppable} from '../dnd/droppable';
import {Draggable} from '../dnd/draggable';
import { getWindowSize } from '../dnd/get-window-size';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

export default function Native() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
  const [isOnCanvas, setIsOnCanvas] = useState(true);
  console.log(itemPosition, isOnCanvas, 'Window Size:', windowSize);
  const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
  const [isAvailable, setIsAvailable] = useState(false);

  function inputImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        console.log('Image URL:', imageUrl);
        // Here you can set the image URL to state or do something with it
        // For example, you can set it to a state variable to display the image
        const imgElement = document.getElementById('image-item') as HTMLImageElement;
        if (imgElement) {
          imgElement.src = imageUrl;
        }
        setIsAvailable(true);
      };
      reader.readAsDataURL(file);
      console.log(isAvailable, 'Image file selected:', file.name);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const windowSize = getWindowSize();
        const newWidth = windowSize.width;
        const newHeight = windowSize.height;
        setWindowSize({ width: newWidth, height: newHeight });
        
        // Only set initial position once
        if (!isInitialized) {
          setItemPosition({ x: newWidth / 2.2, y: newHeight / 2.5 });
          setIsInitialized(true);
        }
      }
    };

    handleResize(); // Set initial size
    
  }, [isInitialized]);

  // Don't render until initialized
  if (!isInitialized) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DndContext onDragEnd={handleDragEnd}>
        {/* Toolbar */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Image Editor - Single Item Canvas
            </h1>
            
            <div className="flex gap-4 items-center">
              {/* {!isOnCanvas && (
                <div className="relative">
                  <Draggable id="single-item">
                    🎯 Drag me to canvas
                  </Draggable>
                </div>
              )} */}
              
              <button
                onClick={() => {
                  setIsOnCanvas(false);
                  setItemPosition({ x: 100, y: 100 });
                  console.log('Item reset to toolbar');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Reset Item
              </button>
              
              <div className="text-sm text-gray-600 flex items-center">
                Status: {isOnCanvas ? 'On Canvas' : 'In Toolbar'}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className=""> {/* Offset for fixed toolbar */}
          <Droppable id="canvas" className="max-h-screen h-full relative overflow-hidden">
            {/* Grid pattern for visual reference */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="w-full max-h-screen h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
            <Input id="image-upload" type="file" accept='image/*' onChange={(e) => inputImage(e)} className={`hidden`} />

            <Draggable
                id="single-item"
                position={itemPosition}
                windowSize={windowSize}
                isAvailable={isAvailable}
              >
                {/* <input type="file" accept='image/*' onChange={(e) => inputImage(e)} className={`${isAvailable ? 'hidden' : ''}`} /> */}
                <Label className={`${isAvailable ? 'hidden' : ''} text-sm text-gray-600 border-2 border-dashed border-slate-300 p-2 rounded-sm`} htmlFor='image-upload'>
                  <Plus className="inline mr-1" />
                  Upload Image
                </Label>
                <Image
                  id='image-item'
                  src="file.svg"
                  alt="Image"
                  width={180}
                  height={38}
                  className={`${isAvailable ? '' : 'hidden'} w-full`}
                  priority
                />
              </Draggable>

            {/* Instructions */}
            {!isOnCanvas && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-500 bg-white rounded-lg p-8 shadow-lg">
                  <h2 className="text-xl font-semibold mb-2">Welcome to the Canvas!</h2>
                  <p>Drag the item from the toolbar above to place it on this canvas.</p>
                  <p className="text-sm mt-2">Once placed, you can move it around freely.</p>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DndContext>
    </div>
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over, delta } = event;

    if (over && over.id === 'canvas') {
      if (isOnCanvas) {
        // Move existing item on canvas
        setItemPosition(prev => ({
          x: prev.x + delta.x,
          y: prev.y + delta.y
        }));
      } else {
        // Place item from toolbar to canvas
        setItemPosition({
          x: delta.x + 100, // Offset from drag start
          y: delta.y + 100
        });
        setIsOnCanvas(true);
      }
    }
  }
}
