export default function BackgroundCanvas({ zoomLevel }: { zoomLevel: number }) {
    return (
        <div className="absolute inset-0 opacity-20">
            <div
                className="w-full h-full"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.1) 2px, transparent 2px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 2px, transparent 2px)
                    `,
                    backgroundSize: `${20 * zoomLevel}px ${20 * zoomLevel}px`,
                }}
            />
        </div>
    )
}