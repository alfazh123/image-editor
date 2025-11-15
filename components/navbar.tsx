import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Image from "next/image"
import Link from "next/link"

export default function Navbar() {
    

    return (
			<div className="flex h-20 w-full items-center justify-center border-b mb-8">
				<NavigationMenu>
					<NavigationMenuList className="flex-wrap">
						<NavigationMenuItem>
							<NavigationMenuLink
								href="/"
								className="px-4 py-2 font-semibold flex items-center space-x-2">
								Home
							</NavigationMenuLink>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuTrigger className="px-4 py-2 font-semibold flex items-center space-x-2">
								Editor
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="flex flex-col p-2 space-y-1 w-56">
									<li>
										<Link
											href="/wasm"
											className="flex items-center p-3 rounded-md bg-[#644FF0] text-white font-semibold gap-2">
											<Image
												width={16}
												height={16}
												className="inline w-4 h-4"
												src="./wasm.svg"
												alt="WASM"
											/>
											<span>WASM</span>
										</Link>
									</li>
									<li>
										<Link
											href="/native"
											className="flex items-center p-3 rounded-md bg-[#F75208] text-white font-semibold gap-2">
											<Image
												width={16}
												height={16}
												className="inline w-4 h-4"
												src="./actix.svg"
												alt="Actix web"
											/>
											<span>Native (Actix web)</span>
										</Link>
									</li>
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<NavigationMenuLink
								href="benchmark-result"
								className="px-4 py-2 font-semibold flex items-center space-x-2">
								Benchmark
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		);
}