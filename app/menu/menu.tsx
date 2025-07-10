'use client';

import { useState } from "react";
import Image from "next/image";

import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
    Tooltip,
    TooltipContent, 
    TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { 
    CircleSlash2,
    Download,
    Layers2, 
    Plus, 
    Pyramid, 
    Replace, 
    Ruler, 
    Wand 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface MenuItemProps {
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imgRefUrl?: string | null;
  disabled?: boolean;
}

export function ColorTransfer(
    { onClick, onChange, imgRefUrl, disabled }: MenuItemProps
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
                    Filter
                </TooltipContent>
            </Tooltip>
                <DropdownMenuContent side='left' className="w-96 p-4">
                    <DropdownMenuLabel>
                        Filter
                    </DropdownMenuLabel>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex justify-between mt-4">
                    <h3>GrayScale</h3>
                    <Switch />
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col justify-between mt-4 gap-6">
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="red-slider">Red</Label>
                        <Slider min={0} max={10} step={1} id="red-slider" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="green-slider">Green</Label>
                        <Slider min={0} max={10} step={1} id='green-slider'/>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="blue-slider">Blue</Label>
                        <Slider min={0} max={10} step={1} id='blue-slider'/>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

type EnhanceProps = {
    value?: number;
    onChange?: (value: number[]) => void;
}

export function Blur({ value, onChange }: EnhanceProps) {

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

export function Sharp({value, onChange}: EnhanceProps) {
    
    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger className="w-full">
                        <Pyramid className="w-12" />
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