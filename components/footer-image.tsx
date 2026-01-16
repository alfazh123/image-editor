import Image from "next/image";
import Link from "next/link";
import { Caveat, Architects_Daughter } from "next/font/google";

const caveat = Caveat({
	subsets: ["latin"],
})

const architecDaughter = Architects_Daughter({
    subsets: ["latin"],
    weight: ["400"]
})

const footerImg = [
	{
		src: "footer-1.png",
		class: "md:top-0 top-10 -left-10 md:hover:-top-10 hover:top-0 hover:-left-12 -rotate-6 z-0",
	},
	{
		src: "footer-2.png",
		class: "md:top-0 top-10 left-0 md:hover:-top-10 hover:top-0 hover:-left-0 z-10",
	},
	{
		src: "footer-3.png",
		class: "md:top-0 top-10 left-10 md:hover:-top-10 hover:top-0 hover:left-12 rotate-6 z-20",
	},
];

export default function FooterImage() {
    return (
        <div className="flex flex-row justify-center md:mt-10 mt-14">
            <div className="w-48 relative">
                {footerImg.map((item, id) => (
                    <Image
                        key={id}
                        src={item.src}
                        alt="app screenshot"
                        width={800}
                        height={600}
                        className={`${item.class} absolute md:w-52 w-48 rounded-xl border-2 border-gray-200 bg-gray-50 p-1 shadow-lg transition-all ease-in-out duration-500`}
                    />
                ))}
                <Image
                    src={'hand-top.svg'}
                    alt='hand'
                    width={800}
                    height={600}
                    className={`absolute -bottom-80 -left-40 w-96 z-30`}
                />
                <Image
                    src={'hand-bottom.svg'}
                    alt='hand'
                    width={800}
                    height={600}
                    className={`absolute -bottom-80 -left-40 w-96 -z-10`}
                />
                <Link href={'https://github.com/alfazh123'} className={`absolute md:top-30 md:-left-50 -top-10 -left-10 md:skew-6 -skew-6 text-2xl ${caveat.className}`}>Create by <br/> Alfazh</Link>
                <Link href={'https://github.com/alfazh123/image-editor'} className={`absolute md:top-30 md:-right-70 -top-7 -right-10 md:-skew-6 skew-6 text-lg ${architecDaughter.className}`}>See Repository</Link>
            </div>
        </div>
    )
}