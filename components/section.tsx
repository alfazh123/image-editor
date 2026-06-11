import Link from "next/link";
import FeatureCard from "./feature-card";
import FooterImage from "./footer-image";
import { Button } from "./ui/button";

export function FeatureSection() {
    return (
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
    )
}

export function MainGoalSection() {
    return (
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
    )
}