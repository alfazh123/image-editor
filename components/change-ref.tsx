import Image from "next/image";
import { Button } from "./ui/button";
import { InputRefBannerProps, InputRefProps, MenuFilter } from "@/app/menu/type";
import { Ban, Plus, Replace } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function InputRefBanner({
	imgRefUrl,
	onClick,
	onChange,
}: InputRefBannerProps) {
	return (
		<div className="space-y-4 relative mt-7">
			<div>
				<Input
					id="image-ref-upload"
					type="file"
					accept="image/*"
					onChange={onChange}
					className="hidden"
				/>
				{!imgRefUrl && (
					<Label
						htmlFor="image-ref-upload"
						className="cursor-pointer flex items-center h-45 border-3 border-dashed border-gray-300 p-4 mt-4 rounded-lg hover:bg-gray-50">
						<Plus className="inline mr-2" />
						Upload Reference Image
					</Label>
				)}
			</div>
			{imgRefUrl && (
				<div className="flex md:flex-col flex-row items-center justify-center gap-4">
					{/* <div className="mt-4"> */}
					<Image
						id="image-ref"
						src={imgRefUrl}
						alt="Reference"
						width={300}
						height={200}
						className="md:w-full w-36 h-auto rounded-lg"
					/>
					{/* </div> */}
					<Tooltip>
						<TooltipTrigger className="hidden md:block absolute -top-4 -right-2">
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

					<div className="flex flex-col w-full gap-2">
						<Button variant="outline" className="w-full h-full p-0">
							<Label
								htmlFor="image-ref-upload"
								className="cursor-pointer flex items-center justify-center px-2 py-3 w-full h-full md:hidden">
								Change Reference Image
							</Label>
						</Button>

						<Button
							className="md:mt-4 md:w-full flex-1 h-full"
							onClick={onClick}>
							Transfer Color
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export function ApplyFilterButton({
	onChangeFilter,
	name,
	color,
	backgroundImage,
}: MenuFilter) {
	return (
		<Button
			className="flex flex-col justify-center w-fit h-fit"
			variant={"ghost"}
			onClick={onChangeFilter}>
			<div
				className={`flex items-center justify-center md:w-20 md:h-20 w-14 h-14 ${color} rounded-md`}>
				{name === "No Filter" ? <Ban className="w-16 h-16" /> : null}
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
			<p className="text-sm text-gray-600 mt-1 w-full text-center">{name}</p>
		</Button>
	);
}