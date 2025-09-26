import FeatureCard from "@/components/feature-card"

const features = [
	{
		title: "Image Color Transfer",
		demo: "/feature-demo/transfer-color.mp4",
		icon: "feature-icon/one.svg",
		backgroundColor: "bg-[#6CBBFB]",
	},
	{
		title: "Adjust Sharpness",
		demo: "/feature-demo/sharp.mp4",
		icon: "feature-icon/two.svg",
		backgroundColor: "bg-[#69DB7C]",
	},
	{
		title: "Adjust Lightness",
		demo: "/feature-demo/light.mp4",
		icon: "feature-icon/three.svg",
		backgroundColor: "bg-[#ff8787]",
	},
	{
		title: "Adjust Color Image",
		demo: "/feature-demo/color.mp4",
		icon: "feature-icon/four.svg",
		backgroundColor: "bg-[#FFE792]",
	},
];

export default function MultimediaBenchmarkPage() {
    return (
        <div>Hai
            <div className="mx-auto w-full grid sm:grid-cols-2 gap-4 items-center justify-center">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>

        </div>
    )
}