import { CircleDotDashed, Home, Paintbrush } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
	return (
		<div className="flex h-20 group w-full items-center justify-end relative">
			<CircleDotDashed
				className={`left-8 group-hover:animate-spin duration-200`}
				// onClick={() => setIsOpen(true)}
			/>
			<div className="absolute top-4 z-10 right-10 hidden group-hover:block">
				<div className="relative flex flex-col gap-2">
					<Link
						href="/"
						className="flex bg-slate-100 shadow w-11 h-11 items-center justify-center rounded-full">
						<Home />
					</Link>
					<Link
						href="/wasm"
						className="flex bg-slate-100 shadow w-11 h-11 items-center justify-center rounded-full absolute top-12 left-8">
						<Paintbrush />
					</Link>
				</div>
			</div>
		</div>
	);
}
