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
	CheckCheck,
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
	BenchmarkTestProps,
	AdjustColorProps,
	AdjustLightProps,
	TestAttemptsProps,
} from "./type";
import { ApplyFilterButton, InputRefBanner } from "@/components/change-ref";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

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
						<TooltipContent side="bottom">Download</TooltipContent>
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

export function BenchmarkMenu(props: BenchmarkTestProps) {
	const testAttempts = props.testAttempts;
	const latency = Number(props.resultSpeed?.latency.toFixed(2));
	const downloadSpeed =
		Number(props.resultSpeed?.downloadSpeed.toFixed(2)) ?? 0;
	const uploadSpeed = Number(props.resultSpeed?.uploadSpeed.toFixed(2)) ?? 0;

	function isCanSubmit(): boolean {
		return (
			testAttempts.colorTransfer >= 5 &&
			testAttempts.sharpness >= 10 &&
			testAttempts.saturation >= 10 &&
			testAttempts.temperature >= 10 &&
			testAttempts.tint >= 10 &&
			testAttempts.exposure >= 10 &&
			testAttempts.contrast >= 10
		);
	}

	function startBenchmarkWithLatency() {
		console.log("Starting benchmark with latency...");
		// props.startBenchmarkFunc;
		props.runSpeedTest();
		props.setStartBenchmark(true);
		console.log("Running speed test...");
	}

	return (
		<MenuItem
			icon={<NotebookPen className="md:w-12 w-6" />}
			label="Benchmark"
			windowSize={props.windowSize}>
			<div className="flex flex-col w-full my-2 rounded-2xl gap-4">
				{!props.startBenchmark && !props.isLoading && !props.isFinished && (
					<div className="text-sm text-gray-500">
						<div className="flex justify-center items-center gap-4 mb-4">
							<p className="text-black">
								Enable this option to display latency records per action.
							</p>
							<Switch onClick={props.changeUseLatency} />
						</div>
						<Button
							className="mb-4 w-full flex items-center justify-center"
							onClick={
								props.useLatency
									? startBenchmarkWithLatency
									: () => props.setStartBenchmark(true)
							}>
							<span className="text-sm">Start Benchmark</span>
						</Button>
					</div>
				)}
				{!props.isLoading &&
					!props.isFinished &&
					props.startBenchmark &&
					props.useLatency && (
						<Button
							className="w-full flex items-center justify-center"
							onClick={props.runSpeedTest}>
							<span className="text-sm">Setup Benchmark</span>
						</Button>
					)}
				{props.isLoading && (
					<span className="text-sm text-gray-500">Setup Environment...</span>
				)}
				{!props.isLoading && props.startBenchmark && (
					<>
						<BenchmarkSegmen
							data={testAttempts}
							type={props.useLatency}
							internetSpeed={{
								downloadSpeed,
								uploadSpeed,
								latency,
							}}
						/>
						<span className="flex gap-2">
							<Button
								onClick={props.submitResult}
								className={`flex-1 ${
									isCanSubmit() ? "" : "opacity-50 cursor-not-allowed"
								}`}>
								See Result
							</Button>
						</span>
					</>
				)}
				{props.error && !props.isLoading && (
					<span className="text-sm text-red-500">{props.error}</span>
				)}
			</div>
		</MenuItem>
	);
}

function BenchmarkSegmen({
	data,
	type,
	internetSpeed,
}: {
	data: TestAttemptsProps;
	type: boolean;
	internetSpeed?: {
		downloadSpeed: number;
		uploadSpeed: number;
		latency: number;
	};
}) {
	const testDataCount = [
		{ label: "Color Transfer", key: "colorTransfer", minVal: 5 },
		{ label: "Sharpness", key: "sharpness", minVal: 10 },
		{ label: "Saturation", key: "saturation", minVal: 10 },
		{ label: "Temperature", key: "temperature", minVal: 10 },
		{ label: "Tint", key: "tint", minVal: 10 },
		{ label: "Exposure", key: "exposure", minVal: 10 },
		{ label: "Contrasts", key: "contrast", minVal: 10 },
	];
	return (
		<div>
			{type && (
				<div>
					<p>latency: {internetSpeed?.latency} ms</p>
					<p>downloadSpeed: {internetSpeed?.downloadSpeed} ms</p>
					<p>uploadSpeed: {internetSpeed?.uploadSpeed} ms</p>
				</div>
			)}
			<span className="text-sm w-full flex flex-col my-4">
				{testDataCount.map(({ label, key, minVal }) => (
					<span key={key} className="flex w-72 justify-between mx-auto">
						<p>{label} Attempt </p>
						<div className="flex gap-1">
							<div className="w-16 justify-center items-center flex">
								{data[key as keyof typeof data] >= minVal ? (
									<Badge className={`bg-blue-500`}>
										<CheckCheck />
									</Badge>
								) : (
									<p>
										{data[key as keyof typeof data]} / {minVal}
									</p>
								)}
							</div>
						</div>
					</span>
				))}
			</span>
		</div>
	);
}