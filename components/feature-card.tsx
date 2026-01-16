import { Eye } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Image from "next/image";
import { useState } from "react";

const features = [
	{
		title: "Adjust Color Image",
		demo: "feature-demo/color.mp4",
		icon: "feature-icon/four.svg",
		backgroundColor: "bg-[#FFE792]",
		zIndex: 10,
		position: 0,
	},
	{
		title: "Adjust Lightness",
		demo: "feature-demo/light.mp4",
		icon: "feature-icon/three.svg",
		backgroundColor: "bg-[#ff8787]",
		zIndex: 20,
		position: 20,
	},
	{
		title: "Adjust Sharpness",
		demo: "feature-demo/sharp.mp4",
		icon: "feature-icon/two.svg",
		backgroundColor: "bg-[#69DB7C]",
		zIndex: 30,
		position: 40,
	},
	{
		title: "Image Color Transfer",
		demo: "feature-demo/transfer-color.mp4",
		icon: "feature-icon/one.svg",
		backgroundColor: "bg-[#6CBBFB]",
		zIndex: 40,
		position: 60,
	},
];

export default function FeatureCard() {
	const [hoverIndex, setHoverIndex] = useState<number | null>(null);
	return (
		<div className="mx-auto w-full flex lg:justify-end sm:justify-center justify-start items-center">
			<div className="relative sm:h-96 h-56 sm:w-96 w-[80%] lg:mt-0 my-20">
				{features.map((feat, index) => (
					<Card
						key={index}
						style={{
							position: "absolute",
							top: `${
								hoverIndex === index ? feat.position - 100 : feat.position
							}px`,
							left: `${feat.position}px`,
							zIndex: `${feat.zIndex}`,
							transition: "all 500ms ease-in-out",
							cursor: "pointer",
						}}
						onMouseEnter={() => setHoverIndex(index)}
						onMouseLeave={() => setHoverIndex(null)}
						className={`h-full sm:w-96 w-[100%] max-h-80 ${feat.backgroundColor} -skew-y-6 shadow-2xl`}>
						<CardContent className="h-full w-full relative px-6">
							<div className="flex flex-col justify-between items-start space-y-4 lg:col-span-2 col-span-3">
								<div className="flex flex-col gap-2">
									<Dialog>
										<DialogTrigger asChild>
											<h3
												className={`lg:text-5xl md:text-3xl text-xl font-semibold w-[96%] opacity-60 hover:underline underline-offset-1`}>
												{feat.title}
											</h3>
										</DialogTrigger>
										<DialogTrigger asChild>
											<Badge
												className={`cursor-pointer rounded-full h-7 w-7 p-0 tabular-nums opacity-60`}>
												<Eye />
											</Badge>
										</DialogTrigger>
										<DialogContent className="min-w-3/4">
											<DialogTitle className="text-2xl font-semibold">
												{feat.title}
											</DialogTitle>
											<div className="flex flex-col gap-4">
												<video
													src={feat.demo}
													autoPlay
													loop
													className="w-full rounded-lg border-2 border-gray-200 p-1 shadow-lg"
												/>
												<p className="text-sm text-muted-foreground">
													This is a demo of the <strong>{feat.title}</strong>{" "}
													feature.
												</p>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</div>
							<div
								className="flex absolute sm:bottom-0 sm:right-0 -bottom-6 right-2 sm:w-auto sm:h-auto w-[100px] h-[100px] overflow-hidden"
								style={{ pointerEvents: "none" }}>
								<Image
									src={feat.icon || "globe.svg"}
									alt={feat.title}
									width={100}
									height={100}
									className={`lg:w-28 ${
										feat.icon?.includes("four")
											? "lg:h-36 sm:h-28 h-32"
											: "lg:h-28 sm:h-22 h-28"
									}`}
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
