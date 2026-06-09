import { useLayoutEffect, useState } from "react";
import { useImageEditor } from "./useImageEditor";
import { getWindowSize } from "../dnd/get-window-size";
import { DragEndEvent } from "@dnd-kit/core";

export function useSetUpPosition(hook: ReturnType<typeof useImageEditor>) {
    const [itemPosition, setItemPosition] = useState({ x: 0, y: 0 });
    const [isOnCanvas, setIsOnCanvas] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);


    useLayoutEffect(() => {
        const handleResize = () => {
            if (typeof window !== "undefined") {
                const windowSize = getWindowSize();
                const newWidth = windowSize.width;
                const newHeight = windowSize.height;
                hook.setWindowSize({ width: newWidth, height: newHeight });

                setItemPosition({
                    x: newWidth > 400 ? newWidth / 2.2 - 150 : 0,
                    y: newWidth > 400 ? newHeight / 2.5 : newHeight / 2,
                });
                setIsInitialized(true);
            }
        };

        handleResize(); // Set initial size
        window.addEventListener("resize", handleResize);
        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    function handleDragEnd(event: DragEndEvent): void {
        const { over, delta } = event;
    
        if (over && over.id === "canvas") {
            if (isOnCanvas) {
                // Move existing item on canvas
                setItemPosition((prev) => ({
                    x: prev.x + delta.x,
                    y: prev.y + delta.y,
                }));
            } else {
                // Place item from toolbar to canvas
                setItemPosition({
                    x: delta.x, // Offset from drag start
                    y: delta.y,
                });
                setIsOnCanvas(true);
            }
        }
    }

    return { itemPosition, handleDragEnd, isOnCanvas, isInitialized };
}