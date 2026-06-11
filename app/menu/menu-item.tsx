import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
	MenuItemDetailProps,
	MenuItemLabelProps,
	SliderMenuItemProps,
	SliderWithValueMenuItemProps,
	SliderZoomProps,
} from "./type";

export function MenuItemLabel({
	id,
	icon,
	handleOpenChange,
	selectedId,
}: MenuItemLabelProps) {
	return (
		<div
			onClick={() => handleOpenChange(id)}
			className={`p-2 cursor-pointer w-full hover:bg-zinc-100 ${selectedId === id ? "bg-white" : ""} rounded-lg transition-colors duration-200 flex items-center justify-center`}>
			<div>{icon}</div>
		</div>
	);
}

export function MenuItemDetail({
	label,
	children,
	selectedId,
	id,
}: MenuItemDetailProps) {
	return (
		<div
			className={`${selectedId === id ? "flex" : "hidden"} flex-col gap-4 mt-4`}>
			<p className="text-xl font-semibold text-gray-600">{label}</p>
			{children}
		</div>
	);
}

export function SliderMenuItem({
	value,
	id,
	onChange,
	selectedId,
}: SliderMenuItemProps) {
	return (
		<div
			className="flex flex-col gap-2 md:py-10"
			id={selectedId === id ? "active" : ""}>
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
