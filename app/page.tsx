"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { describe } from "node:test";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Target } from "lucide-react";

const features = [
	{
		title: "Image Color Transfer",
		describe:
			"Apply Color image reference from computer or availabel image to image target.",
		references: [
			{
				name: "Color Transfer between Images",
				url: "http://ieeexplore.ieee.org/document/946629/citations",
			},
		],
		demo: "/feature-demo/transfer-color.mp4",
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
	},
	{
		title: "Adjust Color Image",
		describe: "Adjust color of image such as saturation, temperature and tint.",
		references: [
			{
				name: "Simple algorithms for adjusting image temperature and tint",
				url: "https://tannerhelland.com/2014/07/01/simple-algorithms-adjusting-image-temperature-tint.html",
			},
		],
		demo: "/feature-demo/color.mp4",
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
		<div className="flex flex-col gap-8 xl:w-1/2 md:w-3/4 w-full mx-auto px-8">
			<header className="flex flex-col w-full h-80 justify-center border-b-2 border-gray-200">
				<div className="flex flex-col gap-4">
					<h1 className="md:text-6xl text-4xl font-bold">
						Image editor with Rust Benchmarks
					</h1>
				</div>
			</header>
			<div id="info" className="flex flex-col gap-4">
				<h2 className="md:text-2xl text-lg font-semibold">
					What is the purpose of this image editor?
				</h2>
				<p className="md:text-lg text-sm">
					This image editor page provides two different implementations of image
					processing written in Rust, one using
					<Link href={"https://webassembly.org/"} target="_blank">
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
					<Link href={"https://actix.rs/"} target="_blank">
						<Badge className="bg-red-600">
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
			<div className="flex flex-col gap-4 relative">
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
			<div className="flex flex-col gap-4">
				<h2 className="md:text-2xl text-lg font-semibold">Features</h2>
				<div className="mx-auto w-full">
					<Carousel setApi={setApi} className="w-full cursor-all-scroll">
						<CarouselContent>
							{features.map((feat, index) => (
								<CarouselItem key={index}>
									<Card>
										<CardContent className="grid sm:grid-cols-3 md:h-80 h-64 w-full px-6">
											<div className="flex flex-col justify-between items-start space-y-4 md:col-span-2 col-span-3">
												<div className="flex flex-col gap-2">
													<h3 className="lg:text-5xl text-4xl font-semibold">
														{feat.title}
													</h3>
													<p className="md:text-lg lg:text-xl text-sm">
														{feat.describe}
													</p>
													<Dialog>
														<DialogTrigger asChild>
															<Badge className="cursor-pointer rounded-full h-7 w-7 p-0 tabular-nums">
																<Eye />
															</Badge>
														</DialogTrigger>
														<DialogContent className="lg:min-w-3/4 md:min-w-1/2 min-w-3/4">
															<DialogTitle className="text-2xl font-semibold">
																{feat.title}
															</DialogTitle>
															<div className="flex flex-col gap-4">
																<video
																	src={feat.demo}
																	autoPlay
																	className="w-full rounded-lg border-2 border-gray-200 p-1 shadow-lg"
																	poster="/app.png"
																/>
																<p className="text-sm text-muted-foreground">
																	This is a demo of the{" "}
																	<strong>{feat.title}</strong> feature.
																</p>
															</div>
														</DialogContent>
													</Dialog>
												</div>
												<span>
													{feat.references &&
														feat.references.map((ref, id) => (
															<div key={id}>
																<h5>Reference:</h5>
																<Link
																	href={ref.url}
																	className="underline underline-offset-2 cursor-pointer overflow-hidden"
																	target="_blank">
																	{ref.name}
																</Link>
															</div>
														))}
												</span>
											</div>
										</CardContent>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
						{/* <CarouselPrevious />
						<CarouselNext /> */}
						<div className="text-muted-foreground py-2 text-center text-sm">
							<CarouselPrevious />
							Feature {current} of {count}
							<CarouselNext />
						</div>
					</Carousel>
				</div>
			</div>
		</div>
	);
}
