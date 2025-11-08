"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import BenchmarkChart from "@/components/benchmark-chart";
import FeatureCard from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

const features = [
	{
		title: "Image Color Transfer",
		demo: "feature-demo/transfer-color.mp4",
		icon: "feature-icon/one.svg",
		backgroundColor: "bg-[#6CBBFB]",
	},
	{
		title: "Adjust Sharpness",
		demo: "feature-demo/sharp.mp4",
		icon: "feature-icon/two.svg",
		backgroundColor: "bg-[#69DB7C]",
	},
	{
		title: "Adjust Lightness",
		demo: "feature-demo/light.mp4",
		icon: "feature-icon/three.svg",
		backgroundColor: "bg-[#ff8787]",
	},
	{
		title: "Adjust Color Image",
		demo: "feature-demo/color.mp4",
		icon: "feature-icon/four.svg",
		backgroundColor: "bg-[#FFE792]",
	},
];

export default function Home() {
	return (
		<div>
			<div className="flex flex-col xl:w-1/2 sm:w-3/4 w-full mx-auto sm:px-8 px-4">
				<Navbar />
				<header className="flex flex-col w-full h-80 justify-center relative mb-10">
					<div className="flex flex-col gap-4 lg:max-w-1/2">
						<h1 className="md:text-6xl text-4xl font-bold">
							Image editor with Rust Benchmarks
						</h1>
					</div>
					<Image
						src={"tools.svg"}
						alt="app screenshot"
						width={800}
						height={600}
						className="w-96 rounded-xl p-1 lg:block hidden absolute -right-20 top-10 mask-r-from-40% mask-r-to-90%"
					/>
				</header>

				{/* Main goal */}
				<div id="info" className="flex flex-col gap-4 mt-8">
					<h2 className="md:text-2xl text-lg font-semibold">
						Goal of this Application
					</h2>
					<p className="md:text-lg text-sm">
						This image editor page provides two different implementations of
						image processing written in Rust, one using
						<Badge className="bg-[#644FF0]">
							<Image
								width={16}
								height={16}
								className="inline w-4 h-4"
								src="./wasm.svg"
								alt="WASM"
							/>
							WebAssembly (WASM)
						</Badge>
						and the other using{" "}
						<Badge className="bg-[#F75208]">
							<Image
								width={16}
								height={16}
								className="inline w-4 h-4"
								src="./actix.svg"
								alt="Actix web"
							/>
							Actix web
						</Badge>
						<br />
						This page allows you to compare the performance of these two
						implementations by applying image filters and compare time execution
						of each implementation.
					</p>
				</div>
				<div className="flex flex-col gap-4 relative mt-12">
					{/* <Badge
					variant={"default"}
					className="absolute top-2 md:-left-10 -left-4 -rotate-30 md:text-[14px] text-[10px]">
					Application overview
				</Badge> */}
					{/* <Image
					src={"app.png"}
					alt="app screenshot"
					width={800}
					height={600}
					className="w-full rounded-xl border-2 border-gray-200 p-1 shadow-lg"
				/> */}
				</div>
				<div className="flex flex-col gap-4 mt-12">
					<h2 className="md:text-2xl text-lg font-semibold">Features</h2>
					<p>
						Explore the various features of this image editor, powered by Rust
						and WebAssembly.
					</p>
					<div className="mx-auto w-full grid sm:grid-cols-2 gap-4 items-center justify-center">
						{features.map((feat, index) => (
							<FeatureCard key={index} {...feat} />
						))}
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
		</div>
	);
}
