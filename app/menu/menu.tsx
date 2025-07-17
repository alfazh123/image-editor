'use client';

import React, { useState } from "react";
import Image from "next/image";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
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
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

import {
	Ban,
	CircleSlash2,
	Download,
	Layers2,
	Plus,
	Replace,
	Ruler,
	Settings2,
} from "lucide-react";

export type menuFilter = {
    onChangeFilter: () => void;
    name: string;
    color: string;
    backgroundImage?: string | null;
}

interface MenuItemProps {
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgRefUrl?: string | null;
  menuFilter?: menuFilter[];
}

export function ColorTransfer(
    { onClick, onChange, imgRefUrl, menuFilter }: MenuItemProps
) {

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="w-full">
                        <Layers2 className="w-12" />
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side='left'>
                    Presets
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side='left' className="min-w-96 p-4">
                    <DropdownMenuLabel>
                        Presets
                    </DropdownMenuLabel>
                    <Tabs defaultValue="account" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="account">With Image</TabsTrigger>
                            <TabsTrigger value="password">Other</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">

                            <div className="space-y-4 relative mt-7">
                                <div>
                                    <Input 
                                        id="image-ref-upload" 
                                        type="file" 
                                        accept='image/*'
                                        onChange={onChange}
                                        className="hidden"
                                    />
                                    {imgRefUrl ? 
                                    (
                                        <Tooltip>
                                            <TooltipTrigger className="absolute -top-4 -right-2">
                                                <Label htmlFor="image-ref-upload" className="cursor-pointer flex items-center border-3 border-gray-300 p-2 rounded-lg bg-gray-50">
                                                    <Replace className="inline mr-2" />
                                                </Label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Change Reference Image</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <Label htmlFor="image-ref-upload" className="cursor-pointer flex items-center h-45 border-3 border-dashed border-gray-300 p-4 mt-4 rounded-lg hover:bg-gray-50">
                                            <Plus className="inline mr-2" />
                                            Upload Reference Image
                                        </Label>
                                    )}
                                </div>
                                {imgRefUrl && (
                                    <div>
                                        <div className="mt-4">
                                        <Image 
                                            id="image-ref"
                                            src={imgRefUrl} 
                                            alt="Reference" 
                                            width={300} 
                                            height={200} 
                                            className="w-full h-auto rounded-lg" 
                                        />
                                        </div>

                                        <Button 
                                            variant="outline" 
                                            className="mt-4 w-full"
                                            onClick={onClick}
                                        >
                                            Transfer Color
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="password" className="flex flex-wrap justify-center">
                            {menuFilter?.map((filter) => (
                                <Button className="flex flex-col justify-center w-fit h-fit" variant={"ghost"} onClick={filter.onChangeFilter} key={filter.name}>
                                    <div className={`flex items-center justify-center w-20 h-20 ${filter.color} rounded-md`}>
                                        {filter.name === 'No Filter' ? <Ban className="w-16 h-16"/> : null}
                                        {filter.backgroundImage ? (
                                            <Image 
                                                src={filter.backgroundImage} 
                                                alt={filter.name} 
                                                width={80} 
                                                height={80} 
                                                className="rounded-md object-cover w-full h-full"
                                            />
                                        ) : (
                                            null
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 w-full text-center">
                                        {filter.name}
                                    </p>
                                </Button>
                            ))}
                        </TabsContent>
                    </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type EnhanceProps = {
    blurValue?: number;
    onChangeBlur?: (value: number[]) => void;
    sharpValue?: number;
    onChangeSharp?: (value: number[]) => void;
}

export function Blur({ blurValue: value, onChangeBlur: onChange }: EnhanceProps) {

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="w-full">
                        <CircleSlash2 className="w-12" />
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side='left'>
                    Blur Image
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side='left' className="w-96 min-h-45 p-4">
                <DropdownMenuLabel>
                    Blur Image
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className='flex flex-col gap-2 items-center py-10'>
                    <Label htmlFor='blur-image-feat'>Blur Level</Label>
                    <p className="text-sm text-gray-600 mb-2">
                        Current Blur Level: {value || 0}
                    </p>
                    <Slider value={typeof value === "number" && value >= 0 ? [value] : [0]} min={0} max={10} step={1} id='blur-image-feat' onValueChange={onChange}/>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function Sharp({sharpValue: value, onChangeSharp: onChange}: EnhanceProps) {
    
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="w-full">
                        <CircleSlash2 className="w-12" />
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side='left'>
                    Sharp Image
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side='left' className="w-96 min-h-45 p-4">
                <DropdownMenuLabel>
                    Sharp Image
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className='flex flex-col gap-2 items-center py-10'>
                    <Label htmlFor='sharp-image-feat'>Sharpness Level</Label>
                    <p className="text-sm text-gray-600 mb-2">
                        Current Sharpness Level: {value || 0}
                    </p>
                    <Slider value={typeof value === "number" && value >= 0 ? [value] : [0]} min={0} max={10} step={1} id='sharp-image-feat' onValueChange={onChange}/>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type DisplaySizeProps = {
    width: number;
    height: number;
}

export function DisplaySize({ width, height }: DisplaySizeProps) {
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="w-full">
                        <Ruler className="w-12" />
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side='left'>
                    Size Image
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side='left' className="w-96 min-h-45 p-4">
                <DropdownMenuLabel>
                    Size Image
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className='flex gap-2 items-center py-10'>
                    <div className="flex flex-col gap-4">
                        <Label>Width</Label>
                        <Input 
                            id="width-file"
                            type="text"
                            readOnly
                            value={width + 'px'}
                            className="cursor-not-allowed"
                        />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label>Height</Label>
                        <Input 
                            id="height-file"
                            type="text"
                            readOnly
                            value={height + 'px'}
                            className="cursor-not-allowed"
                        />
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type DownloadProps = {
    url: string
}

export function DownloadImage({ url }: DownloadProps) {

    const [resultName, setResultName] = useState<string>('result')

    function downloadImage(resultName: string, url: string) {
        const link = document.createElement('a');
        link.href = url;
        link.download = resultName + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function changeNameFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.value.length >= 0) {
            setResultName(e.target.value)
            console.log(resultName)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Download className="w-12" />
                    </TooltipTrigger>
                    <TooltipContent side='left'>
                        Download
                    </TooltipContent>
                </Tooltip>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Download recent result</DialogTitle>
                </DialogHeader>
                <DialogDescription className="flex flex-col gap-4">
                    <Input type="text" id="inputresult-file-name" value={resultName} onChange={changeNameFile}/>
                    <Button className="w-full" onClick={() => downloadImage(resultName, url)}>Download</Button>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

type ToolsProps = {
    saturationValue?: number;
    temperatureValue?: number;
    tintValue?: number;
    contrastValue?: number;
    exposureValue?: number;
    onChangeSaturation?: (value: number[]) => void;
    onChangeTemperature?: (value: number[]) => void;
    onChangeTint?: (value: number[]) => void;
    onChangeContrast?: (value: number[]) => void;
    onChangeExposure?: (value: number[]) => void;
}

export function Tools({
    saturationValue: saturation,
    temperatureValue: temperature,
    tintValue: tint,
    contrastValue: contrast,
    exposureValue: exposure,
    onChangeSaturation: onSaturationChange,
    onChangeTemperature: onTemperatureChange,
    onChangeTint: onTintChange,
    onChangeContrast: onContrastChange,
    onChangeExposure: onExposureChange
}: ToolsProps) {

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="w-full">
                        <Settings2 className="w-12" />
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side='left'>
                    Tools
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent side='left' className="flex flex-col gap-4 w-96 min-h-45 p-4">
                <div>
                    <DropdownMenuLabel>
                        Color
                    </DropdownMenuLabel>
                    <div className="flex flex-col justify-between mt-4 gap-6">
                        <div className="flex flex-col w-full gap-4">
                            <Label htmlFor="saturation-slider" className="flex w-full justify-between">
                                <p>Saturation</p>
                                <p>{saturation || 0}</p>
                            </Label>
                            <Slider value={typeof saturation === "number" ? [saturation] : [0]} min={-6} max={6} step={0.5} id="saturation-slider" onValueChange={onSaturationChange} className="bg-slate-200" />
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <Label htmlFor="temperature-slider" className="flex w-full justify-between">
                                <p>Temperature</p>
                                <p>{temperature || 0}</p>
                            </Label>
                            <Slider value={typeof temperature === "number" ? [temperature] : [0]} min={-6} max={6} step={0.5} id='temperature-slider' onValueChange={onTemperatureChange} className="bg-gradient-to-r from-blue-400 via-slate-200 to-yellow-200" />
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <Label htmlFor="tint-slider" className="flex w-full justify-between">
                                <p>Tint</p>
                                <p>{tint || 0}</p>
                            </Label>
                            <Slider value={typeof tint === "number" ? [tint] : [0]} min={-6} max={6} step={0.5} id='tint-slider' onValueChange={onTintChange} className="bg-gradient-to-r from-green-400 via-slate-200 to-fuchsia-400" />
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <div>
                    <DropdownMenuLabel>
                        Light
                    </DropdownMenuLabel>
                    <div className="flex flex-col justify-between mt-4 gap-6">
                        <div className="flex flex-col w-full gap-4">
                            <Label htmlFor="exposure-slider" className="flex w-full justify-between">
                                <p>Exposure</p>
                                <p>{exposure || 0}</p>
                            </Label>
                            <Slider value={typeof exposure === "number" ? [exposure] : [0]} min={-6} max={6} step={1} id='exposure-slider' onValueChange={onExposureChange} className="bg-slate-200" />
                        </div>
                        <div className="flex flex-col w-full gap-4">
                            <Label htmlFor="contrast-slider" className="flex w-full justify-between">
                                <p>Contrast</p>
                                <p>{contrast || 0}</p>
                            </Label>
                            <Slider value={typeof contrast === "number" ? [contrast] : [0]} min={-6} max={6} step={1} id="contrast-slider" onValueChange={onContrastChange} className="bg-slate-200" />
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}