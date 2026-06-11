"use client";

import { useRef } from "react";
import { useAnimation } from "./hooks/useAnimation";
import Hero from "@/components/hero";
import { FeatureSection, MainGoalSection } from "@/components/section";

export default function Home() {
	const header = useRef<HTMLDivElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const { imageSrc } = useAnimation(header, intervalRef);

	return (
		<div>
			<div className="flex flex-col xl:w-1/2 sm:w-3/4 w-full mx-auto sm:px-8 px-4 gap-20">
				<Hero header={header} imageSrc={imageSrc} />
				<FeatureSection />
				<MainGoalSection />
			</div>
		</div>
	);
}
