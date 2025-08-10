import { Eye } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Image from "next/image";

interface FeatureCardProps {
	title: string;
	demo?: string;
	icon?: string;
	textColor?: string;
	backgroundColor?: string;
}

export default function FeatureCard({
	title,
	demo,
	icon,
	backgroundColor,
}: FeatureCardProps) {
	return (
		<Card className={`h-full w-full lg:min-h-80 ${backgroundColor}`}>
			<CardContent className="h-full w-full relative px-6">
				<div className="flex flex-col justify-between items-start space-y-4 lg:col-span-2 col-span-3">
					<div className="flex flex-col gap-2">
						<h3
							className={`lg:text-5xl md:text-3xl text-xl font-semibold w-[96%] opacity-60`}>
							{title}
						</h3>
						<Dialog>
							<DialogTrigger asChild>
								<Badge
									className={`cursor-pointer rounded-full h-7 w-7 p-0 tabular-nums opacity-60`}>
									<Eye />
								</Badge>
							</DialogTrigger>
							<DialogContent className="min-w-3/4">
								<DialogTitle className="text-2xl font-semibold">
									{title}
								</DialogTitle>
								<div className="flex flex-col gap-4">
									<video
										src={demo}
										autoPlay
										loop
										className="w-full rounded-lg border-2 border-gray-200 p-1 shadow-lg"
									/>
									<p className="text-sm text-muted-foreground">
										This is a demo of the <strong>{title}</strong> feature.
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
						src={icon || "globe.svg"}
						alt={title}
						width={100}
						height={100}
						className={`lg:w-28 ${
							icon?.includes("four")
								? "lg:h-36 sm:h-28 h-32"
								: "lg:h-28 sm:h-22 h-28"
						}`}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
