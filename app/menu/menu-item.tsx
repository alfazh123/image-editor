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
		<div className="flex items-center justify-center w-full h-14 my-2 rounded-2xl hover:bg-gray-100/75 cursor-pointer">
			<DropdownMenu>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger className="w-full flex flex-col items-center justify-center">
							{icon}
							<Label className="text-xs font-light md:hidden">{label}</Label>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="left" className="md:block hidden">
						{label}
					</TooltipContent>
				</Tooltip>
				<DropdownMenuContent
					side={`${
						windowSize?.width !== undefined && windowSize?.width > 768
							? "left"
							: "top"
					}`}
					className={`md:min-w-96 w-[300px] p-4`}>
					<DropdownMenuLabel>{label}</DropdownMenuLabel>
					{children}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function SliderMenuItem({ value, id, onChange }: SliderMenuItemProps) {
	return (
		<div className="flex flex-col gap-2 items-center py-10">
			<Label htmlFor={id}>Blur Level</Label>
			<p className="text-sm text-gray-600 mb-2">
				Current Blur Level: {value || 0}
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
				<p>Saturation</p>
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
	windowSize,
}: SliderZoomProps) {
	const orientation: "vertical" | "horizontal" =
		windowSize?.width !== undefined && windowSize?.width > 789
			? "vertical"
			: "horizontal";

	return (
		<div className="flex flex-col w-full gap-4">
			<Label htmlFor="saturation-slider" className="flex w-full justify-center">
				<p>{Math.round(value[0]) || 0}%</p>
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