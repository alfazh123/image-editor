"use client";

import React, { useState } from "react";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
	MenuItemDetail,
	SliderMenuItem,
	SliderWithValueMenuItem,
} from "./menu-item";
import {
	DisplaySizeProps,
	DownloadProps,
	MenuItemFilterProps,
	SliderMenuItemProps,
	AdjustColorProps,
	AdjustLightProps,
} from "./type";
import { ApplyFilterButton, InputRefBanner } from "@/components/change-ref";

export function ColorTransfer({
	onClick,
	onChange,
	imgRefUrl,
	menuFilter,
	id,
	selectedId,
}: MenuItemFilterProps) {
	return (
		<MenuItemDetail id={id} selectedId={selectedId || ""} label="Preset">
			<Tabs defaultValue="inputRef">
				<TabsList>
					<TabsTrigger value="inputRef">With Image</TabsTrigger>
					<TabsTrigger value="other">Other</TabsTrigger>
				</TabsList>
				<TabsContent value="inputRef">
					<div className="space-y-4 relative mt-7">
						<InputRefBanner
							imgRefUrl={imgRefUrl || ""}
							onClick={onClick}
							onChange={onChange}
						/>
					</div>
				</TabsContent>
				<TabsContent
					value="other"
					className="flex flex-wrap justify-center max-h-60 overflow-y-scroll">
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
		</MenuItemDetail>
	);
}

export function Sharp({
	value,
	onChange,
	id,
	selectedId,
}: SliderMenuItemProps) {
	return (
		<MenuItemDetail id={id} label="Sharp" selectedId={selectedId}>
			<SliderMenuItem
				id="sharp-img-feat"
				value={value}
				onChange={onChange}
				selectedId={selectedId}
			/>
		</MenuItemDetail>
	);
}

export function AdjustColor({ id, colorItem, selectedId }: AdjustColorProps) {
	return (
		<MenuItemDetail label="Color" id={id} selectedId={selectedId}>
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
		</MenuItemDetail>
	);
}

export function AdjustLight({ id, lightItem, selectedId }: AdjustLightProps) {
	return (
		<MenuItemDetail id={id} label="Light" selectedId={selectedId}>
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
		</MenuItemDetail>
	);
}

export function DisplaySize({
	id,
	width,
	height,
	selectedId,
}: DisplaySizeProps) {
	return (
		<MenuItemDetail id={id} label="Size" selectedId={selectedId}>
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
		</MenuItemDetail>
	);
}

export function DownloadImage({ id, url, selectedId }: DownloadProps) {
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
		<MenuItemDetail id={id} label="Download" selectedId={selectedId}>
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
		</MenuItemDetail>
	);
}
