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
import { 
  Plus,
  Redo 
} from 'lucide-react';

import { 
  Blur, 
  ColorTransfer, 
  DisplaySize, 
  DownloadImage, 
  Sharp 
} from '../menu/menu';

import init from 'rust-editor';
import { blurImageWASM, fixSize, getSizeImgWASM, sharpImageWASM, transferColorWASM } from './func';

export default function Wasm() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
  const [isOnCanvas, setIsOnCanvas] = useState(true);
  console.log(itemPosition, isOnCanvas, 'Window Size:', windowSize);
  const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
  const [isAvailable, setIsAvailable] = useState(false);

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [imgRefUrl, setImgRefUrl] = useState<string | null>(null);
  const [welcomeOverlay, setWelcomeOverlay] = useState(true);

  // edit file
  const [originalImgArr, setOriginalImgArr] = useState<Uint8Array>(new Uint8Array());
  const [editImgArr, setEditImgArr] = useState<Uint8Array>(new Uint8Array());
  const [refImgArr, setRefImgArr] = useState<Uint8Array>(new Uint8Array());
  const [imageSize, setImageSize] = useState<{width: number, height: number}>({width: 0, height: 0});

  // blur and sharp value set
  const [blurVal, setBlurVal] = useState<number>(0);
  const [sharpVal, setSharpVal] = useState<number>(0);

  const [wasmInitialized, setWasmInitialized] = useState(false);
  const [wasmError, setWasmError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize WASM in useEffect
  useEffect(() => {
    async function initializeWasm() {
      try {
        await init(); // Initialize WASM asynchronously
        setWasmInitialized(true);
        console.log('WASM initialized successfully');
      } catch (error) {
        console.error('Failed to initialize WASM:', error);
        setWasmError(error instanceof Error ? error.message : 'Unknown WASM error');
        console.warn(wasmError);
      }
    }

    initializeWasm();
  }, []);

  async function inputImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!wasmInitialized) {
      console.warn('WASM not initialized');
      return;
    } else {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const fixSizeImg = await fixSize(new Uint8Array(await file.arrayBuffer()));
          const imageUrl = URL.createObjectURL(new Blob([fixSizeImg], {type: 'image/png'}));
          setImgUrl(imageUrl);
          setEditImgArr(fixSizeImg); // Store original image data
          setOriginalImgArr(fixSizeImg); // Store original image data
          setIsAvailable(true);
          const sizeImg = getSizeImgWASM(fixSizeImg); // Get image dimensions using WASM
          setImageSize(sizeImg);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  function inputRefImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fixSizeImg = await fixSize(new Uint8Array(await file.arrayBuffer()));
        const imageRefUrl = URL.createObjectURL(new Blob([fixSizeImg], {type: 'image/png'}));
        setRefImgArr(fixSizeImg); // Store reference image data
        console.log('Reference image data:', fixSizeImg);
        setImgRefUrl(imageRefUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  // Function to process transfer color with WASM
  async function transferColor(imgT: Uint8Array, imgR: Uint8Array): Promise<void> {
    if (!wasmInitialized) {
      console.warn('WASM not initialized');
      return;
    }

    const result = transferColorWASM(imgT, imgR);
    setEditImgArr(await result);
    setImgUrl(ArrToURL(await result));
    setIsLoading(false)
  }

  function handleTransferColor() {
    setIsLoading(true);
    // Do not log isLoading here, as it won't reflect the updated value immediately
    if (originalImgArr.length > 0 && refImgArr.length > 0) {
      console.log('Transfer Color with WASM');
      transferColor(originalImgArr, refImgArr);
    } else {
      setIsLoading(false);
      alert('No image data available for transfer color');
    }
  }

  // blur image
  async function handleBlurChange(value: number[]) {
    setIsLoading(true);
    if (value[0] === 0) {
      setEditImgArr(originalImgArr)
      setImgUrl(ArrToURL(originalImgArr));
    } else {
      setBlurVal(value[0]);
      const result = await blurImageWASM(originalImgArr, value[0]);
      setEditImgArr(result);
      setImgUrl(ArrToURL(result));
    }

    setIsLoading(false);
  }

  // sharp image
  async function handleSharpChange(value: number[]) {
    setIsLoading(true);
    setSharpVal(value[0]);
    const result = await sharpImageWASM(originalImgArr, value[0]);
    setEditImgArr(result);
    setImgUrl(ArrToURL(result));
    setIsLoading(false);
  }

  // Optional: useEffect to observe isLoading changes
  useEffect(() => {
    if (isLoading) {
      console.log('Loading started');
    } else {
      console.log('Loading ended');
    }
  }, [isLoading]);

  function ArrToURL(arr: Uint8Array): string {
    const blob = new Blob([arr], {type: 'image/png'})
    const url = URL.createObjectURL(blob)
    return url
  }

  // Initialize window size and item position on mount
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const windowSize = getWindowSize();
        const newWidth = windowSize.width;
        const newHeight = windowSize.height;
        setWindowSize({ width: newWidth, height: newHeight });
        
        // Only set initial position once
        if (!isInitialized) {
          setItemPosition(
            { 
              x: newWidth / 2.2,
              y: newHeight / 2.5
            });
          setIsInitialized(true);
        }
      }
    };

    handleResize(); // Set initial size
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isInitialized]);

  // Handle drag end event
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

  function closeWelcomeOverlay() {
    setTimeout(() => {
      setWelcomeOverlay(false);
    }, 2000);
  }

  // Don't render until initialized
  if (!isInitialized) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50">  
      <DndContext 
        onDragStart={closeWelcomeOverlay} // Hide overlay when drag starts
        onDragEnd={handleDragEnd}
      >
        {/* Toolbar */}
        {imgUrl && (
          <nav className="fixed flex items-center top-50 bottom-50 right-0 z-50 bg-white shadow-lg border-b w-16 m-4 rounded-2xl justify-center">
            <div className="flex flex-col max-w-7xl mx-auto p-4">
              {/* Transfer Color Tool */}
              <div className='flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer'>
                <ColorTransfer
                  onClick={handleTransferColor}
                  onChange={inputRefImage}
                  imgRefUrl={imgRefUrl}
                />
              </div>

                {/* Blur Tool */}
              <div className='flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer'>
                <Blur 
                  value={blurVal}
                  onChange={handleBlurChange}
                />
              </div>

                {/* Sharp Tool */}
              <div className='flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer'>
                <Sharp 
                  value={sharpVal}
                  onChange={handleSharpChange}
                />
              </div>

              <div className='flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer'>
                <DisplaySize
                  width={imageSize.width}
                  height={imageSize.height}
                />
              </div>

              <div className='flex items-center justify-center w-full p-2 hover:bg-gray-100 rounded-lg cursor-pointer'>
                <DownloadImage
                  url={imgUrl}
                />
              </div>
            </div>
          </nav>
        )}

        {/* Canvas Area */}
        <div className=""> {/* Offset for fixed toolbar */}
          <Droppable id="canvas" className="h-screen relative">
            {/* Grid pattern for visual reference */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>

            {!imgUrl && (
              <div className='flex flex-col justify-center h-45 items-center z-100 mt-40'>
                  <h1 className='text-2xl font-bold text-gray-600 mb-4'>
                    This page use WASM for image processing.
                  </h1>

                  {/* WASM Status */}
                  {!wasmInitialized && !wasmError && (
                    <p className="text-sm text-yellow-500">🔄 Initializing WASM...</p>
                  )}
                  {wasmError && (
                    <p className="text-sm text-red-500">❌ WASM Error: {wasmError}</p>
                  )}
                  {wasmInitialized && (
                    <p className="text-sm text-green-500">✅ WASM Ready</p>
                  )}
              </div>
            )}
            <Input id="image-upload" type="file" accept='image/*' onChange={(e) => inputImage(e)} className={`hidden`} />

            <Draggable
                id="single-item"
                position={itemPosition}
                windowSize={windowSize}
                isAvailable={isAvailable}
              >
                <div className={`absolute -top-0 -right-40 z-50 ${welcomeOverlay || !imgUrl ? 'flex' : 'hidden'}`}>
                    <h2 className="flex gap-2 text-2xl font-bold mb-4 text-gray-600 rotate-12">
                    <Redo className='transform scale-150 -scale-x-150 -rotate-45'/>👋 Drag this
                    </h2>
                </div>
                {/* <input type="file" accept='image/*' onChange={(e) => inputImage(e)} className={`${isAvailable ? 'hidden' : ''}`} /> */}
                <Label className={`${isAvailable ? 'hidden' : ''} text-sm text-gray-600 border-2 border-dashed border-slate-300 p-2 rounded-sm`} htmlFor='image-upload'>
                  <Plus className="inline mr-1" />
                  Upload Image
                </Label>
                {
                  imgUrl && (
                    <div className='relative flex items-center justify-center w-full h-full'>
                      <Image
                        id='image-item'
                        src={imgUrl}
                        alt="Image"
                        width={180}
                        height={38}
                        className={`w-full`}
                        priority
                      />
                      <div>
                        {isLoading && (
                          <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white opacity-15 text-black'>
                            Loading...
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
              </Draggable>
          </Droppable>
        </div>
      </DndContext>
    </div>
  );
}
