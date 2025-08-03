'use client';

import React, { useState } from "react";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
	CircleSlash2,
	Download,
	Layers2,
	NotebookPen,
	Paintbrush,
	Ruler,
	Settings2,
} from "lucide-react";
import { MenuItem, SliderMenuItem, SliderWithValueMenuItem } from "./menu-item";
import {
	DisplaySizeProps,
	DownloadProps,
	MenuItemFilterProps,
	SliderMenuItemProps,
	SpeedTestProps,
	AdjustColorProps,
	AdjustLightProps,
} from "./type";
import { ApplyFilterButton, InputRefBanner } from "@/components/change-ref";

export function ColorTransfer({
	onClick,
	onChange,
	imgRefUrl,
	menuFilter,
	windowSize,
}: MenuItemFilterProps) {
	return (
		<MenuItem
			icon={<Layers2 className="md:w-12 w-6" />}
			label="Preset"
			windowSize={windowSize}>
			<Tabs defaultValue="account">
				<TabsList>
					<TabsTrigger value="account">With Image</TabsTrigger>
					<TabsTrigger value="password">Other</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					<div className="space-y-4 relative mt-7">
						<InputRefBanner
							imgRefUrl={imgRefUrl || ""}
							onClick={onClick}
							onChange={onChange}
						/>
					</div>
				</TabsContent>
				<TabsContent
					value="password"
					className="flex flex-wrap justify-center md:h-auto max-h-36">
					{menuFilter?.map((filter) => (
						<ApplyFilterButton
							key={filter.name}
							onChangeFilter={filter.onChangeFilter}
							name={filter.name}
							color={filter.color}
							backgroundImage={filter.backgroundImage}
						/>
					))}
				</TabsContent>
			</Tabs>
		</MenuItem>
	);
}

export function Blur({ value, onChange }: SliderMenuItemProps) {
	return (
		<MenuItem icon={<CircleSlash2 className="md:w-12 w-6" />} label="Blur">
			<SliderMenuItem id="blur-img-feat" value={value} onChange={onChange} />
		</MenuItem>
	);
}

export function Sharp({ value, onChange, windowSize }: SliderMenuItemProps) {
	return (
		<MenuItem
			icon={<CircleSlash2 className="md:w-12 w-6" />}
			label="Sharp"
			windowSize={windowSize}>
			<SliderMenuItem id="sharp-img-feat" value={value} onChange={onChange} />
		</MenuItem>
	);
}

export function DisplaySize({ width, height, windowSize }: DisplaySizeProps) {
	return (
		<MenuItem
			icon={<Ruler className="md:w-12 w-6" />}
			label="Size"
			windowSize={windowSize}>
			<DropdownMenuSeparator />
			<div className="flex gap-2 items-center justify-center md:py-10">
				<div className="flex flex-col md:items-start items-center gap-4">
					<Label>Width</Label>
					<Input
						id="width-file"
						type="text"
						readOnly
						value={width + "px"}
						className="cursor-not-allowed"
					/>
				</div>
				<div className="flex flex-col md:items-start items-center gap-4">
					<Label>Height</Label>
					<Input
						id="height-file"
						type="text"
						readOnly
						value={height + "px"}
						className="cursor-not-allowed"
					/>
				</div>
			</div>
		</MenuItem>
	);
}

export function DownloadImage({ url }: DownloadProps) {
	const [resultName, setResultName] = useState<string>("result");

	function downloadImage(resultName: string, url: string) {
		const link = document.createElement("a");
		link.href = url;
		link.download = resultName + ".png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function changeNameFile(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.value.length >= 0) {
			setResultName(e.target.value);
			console.log(resultName);
		}
	}

	return (
		<div className="flex items-center justify-center w-full h-full rounded-md hover:bg-gray-100/75 cursor-pointer">
			<Dialog>
				<DialogTrigger className="w-full flex flex-col items-center justify-center">
					<Tooltip>
						<TooltipTrigger asChild className="md:block hidden">
							<Download className="md:w-12 w-6" />
						</TooltipTrigger>
						<TooltipContent side="left">Download</TooltipContent>
					</Tooltip>
					<Download className="w-12 md:hidden" />
					<Label className="text-xs font-light md:hidden">Download</Label>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Download recent result</DialogTitle>
					</DialogHeader>
					<DialogDescription className="flex flex-col gap-4">
						<Input
							type="text"
							id="inputresult-file-name"
							value={resultName}
							onChange={changeNameFile}
						/>
						<Button
							className="w-full"
							onClick={() => downloadImage(resultName, url)}>
							Download
						</Button>
					</DialogDescription>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export function AdjustColor({ colorItem, windowSize }: AdjustColorProps) {
	return (
		<MenuItem
			icon={<Paintbrush className="md:w-12 w-6" />}
			label="Color"
			windowSize={windowSize}>
			<div className="flex flex-col justify-between mt-4 gap-6">
				{colorItem.map((item, index) => (
					<SliderWithValueMenuItem
						key={index}
						title={item.title}
						value={item.value || 0}
						id={item.id}
						onChange={item.onChange}
						className={item.className || "bg-slate-200"}
					/>
				))}
			</div>
		</MenuItem>
	);
}

export function AdjustLight({ lightItem, windowSize }: AdjustLightProps) {
	return (
		<MenuItem
			icon={<Settings2 className="md:w-12 w-6" />}
			label="Light"
			windowSize={windowSize}>
			<div className="flex flex-col justify-between mt-4 gap-6">
				{lightItem.map((item, index) => (
					<SliderWithValueMenuItem
						key={index}
						title={item.title}
						value={item.value || 0}
						id={item.id}
						onChange={item.onChange}
						className={item.className || "bg-slate-200"}
					/>
				))}
			</div>
		</MenuItem>
	);
}

export function SpeedTestMenu(props: SpeedTestProps) {
	return (
		<MenuItem
			icon={<NotebookPen className="md:w-12 w-6" />}
			label="Speed Test"
			windowSize={props.windowSize}>
			<div className="flex flex-col w-full my-2 rounded-2xl hover:bg-gray-100/75 gap-4">
				{!props.isLoading && (
					<Button
						className="w-full h-14 flex items-center justify-center"
						onClick={props.runSpeedTest}>
						<span className="text-sm">Run Speed Test</span>
					</Button>
				)}
				{props.isLoading && (
					<span className="text-sm text-gray-500">Running...</span>
				)}
				{props.isFinished && !props.isLoading && (
					<div className="flex flex-col">
						<span className="text-sm text-gray-500">
							Download: {props.resultSpeed?.downloadSpeed} Mbps
						</span>
						<span className="text-sm text-gray-500">
							Upload: {props.resultSpeed?.uploadSpeed} Mbps
						</span>
						<span className="text-sm text-gray-500">
							Latency: {props.resultSpeed?.latency} ms
						</span>
					</div>
				)}
				{props.error && !props.isLoading && (
					<span className="text-sm text-red-500">{props.error}</span>
				)}
			</div>
		</MenuItem>
	);
}