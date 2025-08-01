import Image from "next/image";
import { Button } from "./ui/button";
import { InputRefBannerProps, InputRefProps, MenuFilter } from "@/app/menu/type";
import { Ban, Plus, Replace } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function InputRefBanner({ imageRefUrl, onClick }: InputRefBannerProps) {
    return (
        <div>
			<div className="mt-4">
				<Image
					id="image-ref"
					src={imageRefUrl}
					alt="Reference"
					width={300}
					height={200}
					className="w-full h-auto rounded-lg"
				/>
			</div>

			<Button
				variant="outline"
				className="mt-4 w-full"
				onClick={onClick}>
					Transfer Color
			</Button>
		</div>
    )
}



export function ApplyFilterButton({onChangeFilter, name, color, backgroundImage}: MenuFilter) {
    return (
        <Button
			className="flex flex-col justify-center w-fit h-fit"
			variant={"ghost"}
			onClick={onChangeFilter}
		>
			<div
				className={`flex items-center justify-center w-20 h-20 ${color} rounded-md`}>
				{name === "No Filter" ? (
					<Ban className="w-16 h-16" />
				) : null}
				{backgroundImage ? (
					<Image
						src={backgroundImage}
						alt={name}
						width={80}
						height={80}
						className="rounded-md object-cover w-full h-full"
					/>
				) : null}
			</div>
			<p className="text-sm text-gray-600 mt-1 w-full text-center">
				{name}
			</p>
		</Button>
    )
}

export function InputRef({ imgRefUrl, onChange }: InputRefProps) {
    return (
        <>
            <Input
                id="image-ref-upload"
                type="file"
                accept="image/*"
                onChange={onChange}
                className="hidden"
            />
                {imgRefUrl ? (
                    <Tooltip>
                        <TooltipTrigger className="absolute -top-4 -right-2">
                            <Label
                                htmlFor="image-ref-upload"
                                className="cursor-pointer flex items-center border-3 border-gray-300 p-2 rounded-lg bg-gray-50">
                                <Replace className="inline mr-2" />
                            </Label>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Change Reference Image</p>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Label
                        htmlFor="image-ref-upload"
                        className="cursor-pointer flex items-center h-45 border-3 border-dashed border-gray-300 p-4 mt-4 rounded-lg hover:bg-gray-50">
                            <Plus className="inline mr-2" />
                            Upload Reference Image
                    </Label>
                )}
        </>
    )
}