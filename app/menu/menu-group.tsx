import { CircleSlash2, Download, Layers2, Paintbrush, Ruler, Settings2 } from "lucide-react";
import { AdjustColor, AdjustLight, ColorTransfer, Sharp } from "./menu";
import { useImageEditor } from "../hooks/useImageEditor";
import { useSharpPRocess } from "../hooks/useSharpProcess";
import { AdjustColorProps, AdjustLightProps } from "./type";
import { useWasmHook } from "../hooks/useWasmEditor";
import TooltipComponent from "@/components/tooltip-component";
import { MenuItemLabel } from "./menu-item";

const menus = [
    {
        id: "tc",
        name: "Transfer Color",
        icon: <Layers2 className="md:w-12 w-6" />,
        description: "Transfer color from one image to another.",
    },
    {
        id: "sh",
        name: "Sharp",
        icon: <CircleSlash2 className="md:w-12 w-6" />,
        description: "Sharpen the image.",
    },
    {
        id: "ac",
        name: "Adjust Color",
        icon: <Paintbrush className="md:w-12 w-6" />,
        description: "Adjust the color of the image.",
    },
    {
        id: "al",
        name: "Adjust Light",
        icon: <Settings2 className="md:w-12 w-6" />,
        description: "Adjust the light of the image.",
    },
    {
        id: "sz",
        name: "Display Size",
        icon: <Ruler className="md:w-12 w-6" />,
        description: "Display the size of the image.",
    },
    {
        id: "dl",
        name: "Download",
        icon: <Download className="md:w-12 w-6" />,
        description: "Download the image.",
    }
]

export default function MenuGroup(
    {
        children,
        handleMenuClick,
        selectedMenu,
    }: {
        children: React.ReactNode;
        handleMenuClick: (id: string) => void;
        selectedMenu: string;
    }
) {

    return (
        <div className=" flex flex-col gap-2 max-w-[399px]  w-full mx-auto">
            <div className="flex justify-between w-full bg-stone-200 p-2 rounded-2xl">
                {menus.map((menu) => (
                    <TooltipComponent text={menu.name} key={menu.id}>
                        <MenuItemLabel
                            key={menu.id}
                            icon={menu.icon}
                            id={menu.id}
                            handleOpenChange={() => handleMenuClick(menu.id)}
                        >
                        </MenuItemLabel>
                    </TooltipComponent>
                ))}
            </div>
            <div className={`bg-stone-100 p-4 rounded-2xl ${selectedMenu ? "flex" : "hidden"} flex-col gap-4`}>
                {children}
            </div>
        </div>
    )
}