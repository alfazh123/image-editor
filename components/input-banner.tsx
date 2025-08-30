import { Plus } from "lucide-react";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface InputBannerProps {
	imageSize: { width: number; height: number };
	windowSize: { width: number; height: number };
	imgUrl: string | null;
	isLoading: boolean;
	isAvailable: boolean;
	inputImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
	style?: React.CSSProperties;
	isUploadImage?: boolean;
}

export function InputBanner({
	imageSize,
	imgUrl,
	isLoading,
	isAvailable,
	inputImage,
	style,
	isUploadImage,
}: InputBannerProps) {
	return (
		<>
			{isUploadImage ? (
				<div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white/70 text-black">
					<div className="flex space-x-2">
						<div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
						<div className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.2s]"></div>
						<div className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.4s]"></div>
					</div>
					<p className="mt-4 text-lg font-medium">Uploading Image...</p>
				</div>
			) : (
				<div>
					<Label
						className={`${
							isAvailable ? "hidden" : ""
						} text-sm text-gray-600 border-2 border-dashed border-slate-300 p-2 rounded-sm`}
						htmlFor="image-upload">
						<Plus className="inline mr-1" />
						Upload Image
					</Label>
					<Input
						id="image-upload"
						type="file"
						accept="image/*"
						onChange={(e) => inputImage(e)}
						className={`hidden`}
					/>
				</div>
			)}
			{imgUrl && (
				<div className={`relative flex items-center justify-center w-full`}>
					<Image
						id="image-item"
						src={imgUrl}
						alt="Image"
						width={imageSize.width}
						height={imageSize.height}
						className="w-auto h-full max-h-full"
						priority
						draggable="false"
						style={style}
					/>
					<div>
						{isLoading && (
							<div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white opacity-15 text-black">
								Loading...
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}