'use client';

import React, { useState } from "react";

import {
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
	Ruler,
	Settings2,
} from "lucide-react";
import { MenuItem, SliderMenuItem, SliderWithValueMenuItem } from "./menu-item";
import {
	DisplaySizeProps,
	DownloadProps,
	MenuItemFilterProps,
	SliderMenuItemProps,
	ToolsProps,
} from "./type";
import {
	ApplyFilterButton,
	InputRef,
	InputRefBanner,
} from "@/components/color-transfer/change-ref";

export function ColorTransfer({
	onClick,
	onChange,
	imgRefUrl,
	menuFilter,
}: MenuItemFilterProps) {
	return (
		<MenuItem icon={<Layers2 className="w-12" />} label="Preset">
			<Tabs defaultValue="account" className="w-[400px]">
				<TabsList>
					<TabsTrigger value="account">With Image</TabsTrigger>
					<TabsTrigger value="password">Other</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					<div className="space-y-4 relative mt-7">
						<div>
							<InputRef onChange={onChange} imgRefUrl={imgRefUrl || null} />
						</div>
						{imgRefUrl && (
							<InputRefBanner imageRefUrl={imgRefUrl} onClick={onClick} />
						)}
					</div>
				</TabsContent>
				<TabsContent value="password" className="flex flex-wrap justify-center">
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
		<MenuItem icon={<CircleSlash2 className="w-12" />} label="Blur Image">
			<SliderMenuItem id="blur-img-feat" value={value} onChange={onChange} />
		</MenuItem>
	);
}

export function Sharp({ value, onChange }: SliderMenuItemProps) {
	return (
		<MenuItem icon={<CircleSlash2 className="w-12" />} label="Sharp Image">
			<SliderMenuItem id="sharp-img-feat" value={value} onChange={onChange} />
		</MenuItem>
	);
}

export function DisplaySize({ width, height }: DisplaySizeProps) {
	return (
		<MenuItem icon={<Ruler className="w-12" />} label="Display Size">
			<DropdownMenuSeparator />
			<div className="flex gap-2 items-center py-10">
				<div className="flex flex-col gap-4">
					<Label>Width</Label>
					<Input
						id="width-file"
						type="text"
						readOnly
						value={width + "px"}
						className="cursor-not-allowed"
					/>
				</div>
				<div className="flex flex-col gap-4">
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
		<div className="flex items-center justify-center aspect-square p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
			<Dialog>
				<DialogTrigger>
					<Tooltip>
						<TooltipTrigger asChild>
							<Download className="w-12" />
						</TooltipTrigger>
						<TooltipContent side="left">Download</TooltipContent>
					</Tooltip>
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

export function Tools({ colorItem, lightItem }: ToolsProps) {
	return (
		<MenuItem icon={<Settings2 className="w-12" />} label="Tools">
			<div>
				<DropdownMenuLabel>Color</DropdownMenuLabel>
				<div className="flex flex-col justify-between mt-4 gap-6">
					{colorItem.map((item, index) => (
						<SliderWithValueMenuItem
							key={index}
							value={item.value || 0}
							id={item.id}
							onChange={item.onChange}
							className={item.className || "bg-slate-200"}
						/>
					))}
				</div>
			</div>

			<DropdownMenuSeparator />

			<div>
				<DropdownMenuLabel>Light</DropdownMenuLabel>
				<div className="flex flex-col justify-between mt-4 gap-6">
					{lightItem.map((item, index) => (
						<SliderWithValueMenuItem
							key={index}
							value={item.value || 0}
							id={item.id}
							onChange={item.onChange}
							className={item.className || "bg-slate-200"}
						/>
					))}
				</div>
			</div>
		</MenuItem>
	);
}