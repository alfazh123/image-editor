import { Redo } from "lucide-react";

export default function WelcomeOverlay({
    welcomeOverlay,
    imgUrl
}: {
    welcomeOverlay: boolean;
    imgUrl: string | null;
}) {
    return (
        <div
            className={`absolute md:-top-0 md:-right-40 -top-10 right-40 z-50 ${
                welcomeOverlay || !imgUrl ? "flex" : "hidden"
            }`}>
            <h2 className="flex gap-2 text-2xl font-bold mb-4 text-gray-600 md:rotate-12 -rotate-12">
                <Redo className="transform scale-150 -scale-x-150 -rotate-45" />
                👋 Drag this
            </h2>
        </div>
    )
}