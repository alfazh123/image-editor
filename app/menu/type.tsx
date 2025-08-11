interface ToolsPropsItem {
	title: string;
	value: number;
	id: string;
	className?: string;
	onChange: (value: number[]) => void;
}

export interface AdjustColorProps {
	colorItem: [ToolsPropsItem, ToolsPropsItem, ToolsPropsItem];
	windowSize?: { width: number; height: number };
}

export interface AdjustLightProps {
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
	imgRefUrl: string;
	onClick: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
	title: string;
	value: number;
	onChange: (value: number[]) => void;
	id: string;
	className?: string;
}

export interface SliderZoomProps {
	value: number;
	onChange: (value: number[]) => void;
	id: string;
	className?: string;
}

export interface SpeedTestResult {
	downloadSpeed: number; // in Mbps
	uploadSpeed: number; // in Mbps
	latency: number; // in ms
}

export interface BenchmarkResultProps {
	latency: number;
	method: string;
	width: number;
	height: number;
	time: number;
}

export interface BenchmarkTestProps {
	runSpeedTest: () => void;
	isFinished: boolean;
	error: string | null;
	isLoading: boolean;
	resultSpeed?: SpeedTestResult;
	windowSize?: { width: number; height: number };
	testAttempts: TestAttemptsProps;
	testAttemptsLatency: TestAttemptsProps;
	stopBenchmark: () => void;
	type: "wasm" | "native";
	submitResult: () => void;
}

interface TestAttemptsProps {
	colorTransfer: number;
	sharpness: number;
	saturation: number;
	temperature: number;
	tint: number;
	exposure: number;
	contrast: number;
}