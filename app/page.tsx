"use client";

import Image from "next/image";
import Link from "next/link";
import FeatureCard from "@/components/feature-card";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FooterImage from "@/components/footer-image";

export default function Home() {
	const [imgIndex, setImgIndex] = useState(0);
	const [imageSrc, setImageSrc] = useState("/animation/tools-1.svg");
	const header = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!header.current) return;

		const handleMouseEnter = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			intervalRef.current = setInterval(() => {
				setImgIndex((prev) => {
					const nextIndex = prev + 1;
					if (nextIndex > 21) {
						return 21;
					}
					setImageSrc(`/animation/tools-${nextIndex}.svg`);
					return nextIndex;
				});
			}, 40);
		};

		const handleMpuseLeave = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			intervalRef.current = setInterval(() => {
				setImgIndex((prev) => {
					const nextIndex = prev - 1;
					if (nextIndex >= 1) {
						setImageSrc(`/animation/tools-${nextIndex}.svg`);
						return nextIndex;
					} else if (prev <= 0) {
						setImageSrc(`/animation/tools-1.svg`);
						return 1;
					}
					return nextIndex;
				});
			}, 40);
		};
		header.current.addEventListener("mouseenter", handleMouseEnter);
		header.current.addEventListener("mouseleave", handleMpuseLeave);

		return () => {
			if (!header.current) return;
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			header.current.addEventListener("mouseenter", handleMouseEnter);
			header.current.addEventListener("mouseleave", handleMpuseLeave);
		};
	}, []);

	return (
		<div>
			<div className="flex flex-col xl:w-1/2 sm:w-3/4 w-full mx-auto sm:px-8 px-4 gap-20">
				{/* <Navbar /> */}
				<header
					ref={header}
					className="flex flex-col w-full h-80 justify-center relative mb-10 mt-30">
					<div className="flex flex-col gap-4 lg:max-w-1/2">
						<h1 className="md:text-6xl text-4xl font-bold">
							Image editor with WASM
						</h1>
						<Button className="rounded-full w-fit" variant={"outline"}>
							<Link href={"/wasm"}>Let's Edit</Link>
						</Button>
					</div>
					<Image
						src={imageSrc}
						alt="app screenshot"
						width={800}
						height={600}
						className="w-96 rounded-xl -rotate-12 p-1 lg:block hidden absolute -right-20 top-10 mask-r-from-40% mask-r-to-90%"
					/>
				</header>

				{/* Feature */}
				<div className="flex lg:flex-row flex-col gap-4 mt-12 items-center">
					<div>
						<h2 className="text-4xl font-bold">Features</h2>
						<p>
							Explore the various features of this image editor, powered by Rust
							and WebAssembly.
						</p>
					</div>
					<FeatureCard />
				</div>

				{/* Main goal */}
				<div
					id="info"
					className="flex flex-col text-center items-center gap-4 mt-8">
					<h1 className="text-4xl font-bold">
						Rust + WASM: A Simple Implementation
					</h1>
					<p className="text-gray-500">
						This project is a technical exploration of how Rust can be
						integrated into web environments using WebAssembly. It serves as a
						hands-on implementation to understand the workflow of processing
						images outside of the JavaScript thread
					</p>
					<Button className="rounded-full w-fit" variant={"outline"}>
						<Link href={"/wasm"}>Wanna Try ?</Link>
					</Button>
					<FooterImage />
				</div>

				{/* Footer */}
				{/* <footer className="flex w-full justify-between mt-8 h-20">
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
							<Github />
						</Link>
					</span>
				</footer> */}
			</div>
		</div>
	);
}
