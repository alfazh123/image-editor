import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Hero({ header, imageSrc }: { header: React.RefObject<HTMLDivElement | null>, imageSrc: string }) {
    return (
        <header
            ref={header}
            className="flex flex-col w-full h-80 justify-center relative mb-10 mt-30">
            <div className="flex flex-col gap-4 lg:max-w-1/2">
                <h1 className="md:text-6xl text-4xl font-bold">
                    Image editor with WASM
                </h1>
                <Button className="rounded-full w-fit" variant={"outline"}>
                    <Link href={"/wasm"}>Let&apos;s Edit</Link>
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
    )
}