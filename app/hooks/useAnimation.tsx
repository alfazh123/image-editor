import { useLayoutEffect, useState } from "react";

export function useAnimation(
    header: React.RefObject<HTMLDivElement | null>,
    intervalRef: React.MutableRefObject<NodeJS.Timeout | null>
) {
    const [imgIndex, setImgIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState("/animation/tools-1.svg");

    useLayoutEffect(() => {
        if (!header.current) return;
        if (!intervalRef) return;

        const handleMouseEnter = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                setImgIndex((prev) => {
                    const nextIndex = prev + 1;
                    if (nextIndex > 21) {
                        return 21;
                    }
                    if (imgIndex) {
                        console.log();
                    }
                    setImageSrc(`animation/tools-${nextIndex}.svg`);
                    return nextIndex;
                });
            }, 40);
        };

        const handleMouseLeave = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(() => {
                setImgIndex((prev) => {
                    const nextIndex = prev - 1;
                    if (nextIndex >= 1) {
                        setImageSrc(`animation/tools-${nextIndex}.svg`);
                        return nextIndex;
                    } else if (prev <= 0) {
                        setImageSrc(`animation/tools-1.svg`);
                        return 1;
                    }
                    return nextIndex;
                });
            }, 40);
        };
        header.current.addEventListener("mouseenter", handleMouseEnter);
        header.current.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            if (!header.current) return;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            header.current.removeEventListener("mouseenter", handleMouseEnter);
            header.current.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return { imageSrc };
}