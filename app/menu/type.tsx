interface ToolsPropsItem {
	value: number;
	id: string;
	className?: string;
	onChange: (value: number[]) => void;
}

export interface ToolsProps {
	colorItem: [ToolsPropsItem, ToolsPropsItem, ToolsPropsItem];
	lightItem: [ToolsPropsItem, ToolsPropsItem];
	windowSize?: { width: number; height: number };
}

export type DownloadProps = {
	url: string;
};

export type DisplaySizeProps = {
	width: number;
	height: number;
	windowSize?: { width: number; height: number };
};

export type MenuFilter = {
	onChangeFilter: () => void;
	name: string;
	color: string;
	backgroundImage?: string | null;
};

export interface MenuItemFilterProps {
	onClick: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	imgRefUrl?: string | null;
	menuFilter?: MenuFilter[];
	windowSize?: { width: number; height: number };
}

export interface InputRefBannerProps {
	imageRefUrl: string;
	onClick: () => void;
}

export interface InputRefProps {
	imgRefUrl: string | null;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface MenuItemProps {
	icon: React.ReactNode;
	label: string;
	children: React.ReactNode;
	windowSize?: { width: number; height: number };
}

export interface SliderMenuItemProps {
	value: number;
	id: string;
	onChange?: (value: number[]) => void;
	windowSize?: { width: number; height: number };
}

export interface SliderWithValueMenuItemProps {
	value: number;
	onChange: (value: number[]) => void;
	id: string;
	className?: string;
}

export interface SliderZoomProps {
	value: number[];
	onChange: (value: number[]) => void;
	id: string;
	className?: string;
	windowSize?: { width: number; height: number };
}