"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import BenchmarkChart from "@/components/benchmark-chart";
import FeatureCard from "@/components/feature-card";
import { BubblesIcon, CircleOff, PaintBucket, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
	{
		title: "Image Color Transfer",
		describe:
			"Apply color transfer between images to change the overall color tone.",
		references: [
			{
				name: "Color Transfer between Images",
				url: "http://ieeexplore.ieee.org/document/946629/citations",
			},
		],
		demo: "/feature-demo/transfer-color.mp4",
		icon: (
			<PaintBucket className="lg:w-28 lg:h-28 sm:w-16 sm:h-16 w-11 h-11 text-gray-400" />
		),
	},
	{
		title: "Adjust Sharpness",
		describe: "Enhance the sharpness of images to improve detail and clarity.",
		references: [
			{
				name: "Perbaikan Citra",
				url: "https://informatika.stei.itb.ac.id/~rinaldi.munir/Buku/Pengolahan%20Citra%20Digital/pdf/Bab-7_Perbaikan%20Kualitas%20Citra.pdf",
			},
		],
		demo: "/feature-demo/sharp.mp4",
		icon: (
			<CircleOff className="lg:w-28 lg:h-28 sm:w-16 sm:h-16 w-9 h-9 text-gray-400" />
		),
	},
	{
		title: "Adjust Lightness",
		describe:
			"Adjust the lightness of image such contrast and exposure for better visibility.",
		references: [
			{
				name: "Perbaikan Citra",
				url: "https://informatika.stei.itb.ac.id/~rinaldi.munir/Buku/Pengolahan%20Citra%20Digital/pdf/Bab-7_Perbaikan%20Kualitas%20Citra.pdf",
			},
		],
		demo: "/feature-demo/light.mp4",
		icon: (
			<Waves className="lg:w-28 lg:h-28 sm:w-16 sm:h-16 w-9 h-9 text-gray-400" />
		),
	},
	{
		title: "Adjust Color Image",
		describe: "Adjust color of image such as saturation, temperature and tint.",
		references: [
			{
				name: "Adjusting image temperature and tint",
				url: "https://tannerhelland.com/2014/07/01/simple-algorithms-adjusting-image-temperature-tint.html",
			},
		],
		demo: "/feature-demo/color.mp4",
		icon: (
			<BubblesIcon className="lg:w-28 lg:h-28 sm:w-16 sm:h-16 w-11 h-11 text-gray-400" />
		),
	},
];

export default function Home() {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!api) {
			return;
		}
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);
		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<div className="flex flex-col xl:w-1/2 sm:w-3/4 w-full mx-auto sm:px-8 px-4">
			<header className="flex flex-col w-full h-80 justify-center border-b-2 border-gray-200">
				<div className="flex flex-col gap-4">
					<h1 className="md:text-6xl text-4xl font-bold">
						Image editor with Rust Benchmarks
					</h1>
				</div>
			</header>

			{/* Main goal */}
			<div id="info" className="flex flex-col gap-4 mt-8">
				<h2 className="md:text-2xl text-lg font-semibold">
					Goal of this Application
				</h2>
				<p className="md:text-lg text-sm">
					This image editor page provides two different implementations of image
					processing written in Rust, one using
					<Link href={"/wasm"}>
						<Badge className="bg-[#644FF0]">
							<Image
								width={16}
								height={16}
								className="inline w-4 h-4"
								src="/wasm.svg"
								alt="WASM"
							/>
							WebAssembly (WASM)
						</Badge>
					</Link>{" "}
					and the other using{" "}
					<Link href={"/native"}>
						<Badge className="bg-[#F75208]">
							<Image
								width={16}
								height={16}
								className="inline w-4 h-4"
								src="/actix.svg"
								alt="WASM"
							/>
							Actix web
						</Badge>
					</Link>
					<br />
					This page allows you to compare the performance of these two
					implementations by applying image filters and compare time execution
					of each implementation.
				</p>
			</div>
			<div className="flex flex-col gap-4 relative mt-12">
				<Badge
					variant={"default"}
					className="absolute top-2 md:-left-10 -left-4 -rotate-30 md:text-[14px] text-[10px]">
					Application overview
				</Badge>
				<Image
					src={"/app.png"}
					alt="app screenshot"
					width={800}
					height={600}
					className="w-full rounded-xl border-2 border-gray-200 p-1 shadow-lg"
				/>
			</div>
			<div className="flex flex-col gap-4 mt-12">
				<h2 className="md:text-2xl text-lg font-semibold">Features</h2>
				<p>
					Explore the various features of this image editor, powered by Rust and
					WebAssembly.
				</p>
				<div className="mx-auto w-full">
					<Carousel setApi={setApi} className="w-full cursor-all-scroll">
						<CarouselContent>
							{features.map((feat, index) => (
								<CarouselItem key={index}>
									<FeatureCard {...feat} />
								</CarouselItem>
							))}
						</CarouselContent>
						<div className="md:flex hidden">
							<CarouselPrevious />
							<CarouselNext />
						</div>
						<div className="text-muted-foreground py-2 text-center text-sm">
							Feature {current} of {count}
						</div>
					</Carousel>
				</div>
			</div>
			<div className="flex flex-col gap-4 mt-12" id="benchmark">
				<BenchmarkChart />
				<Button variant="outline" className="w-full">
					Run Benchmark
				</Button>
			</div>
			<footer className="flex w-full justify-between mt-8 h-20">
				<span className="text-sm">
					Created by{" "}
					<Link href="https://github.com/alfazh123" target="_blank">
						Alfazh
					</Link>
				</span>
				<span className="text-sm">
					<Link
						href="https://github.com/alfazh123/image-editor"
						target="_blank">
						Github Repo
					</Link>
				</span>
			</footer>
		</div>
	);
}
