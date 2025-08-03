import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
	MenuItemProps,
	SliderMenuItemProps,
	SliderWithValueMenuItemProps,
	SliderZoomProps,
} from "./type";

export function MenuItem({ icon, label, children, windowSize }: MenuItemProps) {
	return (
		<div className="flex items-center justify-center w-full h-full rounded-md hover:bg-gray-100/80 cursor-pointer">
			<DropdownMenu>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger className="md:w-full w-20 flex flex-col items-center justify-center">
							{icon}
							<Label className="text-xs font-light md:hidden text-nowrap">
								{label}
							</Label>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom" className="md:block hidden">
						{label}
					</TooltipContent>
				</Tooltip>
				<DropdownMenuContent
					side={`${
						windowSize?.width !== undefined && windowSize?.width > 768
							? "bottom"
							: "top"
					}`}
					className={`md:min-w-96 md:w-96 min-w-full w-screen p-4`}
					onWheel={(e) => e.stopPropagation()}>
					<DropdownMenuLabel>{label}</DropdownMenuLabel>
					{children}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function SliderMenuItem({ value, id, onChange }: SliderMenuItemProps) {
	return (
		<div className="flex flex-col gap-2 md:py-10">
			{/* <Label htmlFor={id}>Sharp Level</Label> */}
			<p className="text-sm text-gray-600 mb-2">
				Current Sharp Level: {value || 0}
			</p>
			<Slider
				value={typeof value === "number" && value >= 0 ? [value] : [0]}
				min={0}
				max={10}
				step={1}
				id={id}
				onValueChange={onChange}
			/>
		</div>
	);
}

export function SliderWithValueMenuItem({
	title,
	value,
	id,
	onChange,
	className,
}: SliderWithValueMenuItemProps) {
	return (
		<div className="flex flex-col w-full gap-4">
			<Label
				htmlFor="saturation-slider"
				className="flex w-full justify-between">
				<p>{title}</p>
				<p>{value || 0}</p>
			</Label>
			<Slider
				value={typeof value === "number" ? [value] : [0]}
				min={-6}
				max={6}
				step={0.5}
				id={id}
				onValueChange={onChange}
				className={className}
			/>
		</div>
	);
}

export function SliderZoom({
	value,
	id,
	onChange,
	className,
}: SliderZoomProps) {
	return (
		<div className="flex flex-col w-full gap-4">
			<Label htmlFor="saturation-slider" className="flex w-full justify-center">
				<p>{value || 0}%</p>
			</Label>
			<div className="md:block hidden">
				<Slider
					orientation="vertical"
					min={50}
					max={180}
					step={10}
					id={id}
					onValueChange={onChange}
					className={className}
					value={typeof value === "number" ? [value] : [100]}
				/>
			</div>
			<div className="md:hidden block">
				<Slider
					orientation="horizontal"
					min={50}
					max={180}
					step={10}
					id={id}
					onValueChange={onChange}
					className={className}
					value={typeof value === "number" ? [value] : [100]}
				/>
			</div>
		</div>
	);
}