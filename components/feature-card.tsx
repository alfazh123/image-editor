import { Eye } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import Link from "next/link";

interface FeatureCardProps {
	title: string;
	describe: string;
	references?: { name: string; url: string }[];
	demo?: string;
	icon?: React.ReactNode;
}

export default function FeatureCard({
	title,
	describe,
	references,
	demo,
	icon,
}: FeatureCardProps) {
	return (
		<Card className="h-full">
			<CardContent className="grid md:grid-cols-3 md:h-80 min-h-72 h-full w-full lg:static relative px-6">
				<div className="flex flex-col justify-between items-start space-y-4 lg:col-span-2 col-span-3">
					<div className="flex flex-col gap-2">
						<h3 className="lg:text-5xl text-4xl font-semibold w-[96%]">
							{title}
						</h3>
						<p className="md:text-lg lg:text-xl text-sm">{describe}</p>
						<Dialog>
							<DialogTrigger asChild>
								<Badge className="cursor-pointer rounded-full h-7 w-7 p-0 tabular-nums">
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
					<span>
						<h5>Reference:</h5>
						{references &&
							references.map((ref, id) => (
								<div key={id}>
									<Link
										href={ref.url}
										className="underline underline-offset-2 cursor-pointer overflow-hidden text-ellipsis"
										target="_blank">
										{ref.name}
									</Link>
								</div>
							))}
					</span>
				</div>
				<div className="flex lg:static absolute -top-2 right-2  items-end justify-end md:col-span-1">
					{icon}
				</div>
			</CardContent>
		</Card>
	);
}
