interface ToolsPropsItem {
	title: string;
	value: number;
	id: string;
	className?: string;
	onChange: (value: number[]) => void;
}

export interface AdjustColorProps {
	id: string;
	colorItem: [ToolsPropsItem, ToolsPropsItem, ToolsPropsItem];
	selectedId: string;
}

export interface AdjustLightProps {
	id: string;
	lightItem: [ToolsPropsItem, ToolsPropsItem];
	selectedId: string;
}

export type DownloadProps = {
	id: string;
	url: string;
	selectedId: string;
};

export type DisplaySizeProps = {
	id: string;
	width: number;
	height: number;
	selectedId: string;
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
	id: string;
	selectedId: string;
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

export interface MenuItemLabelProps {
	id: string;
	icon: React.ReactNode;
	handleOpenChange: (id: string) => void;
	selectedId?: string;
}

export interface MenuItemDetailProps {
	id: string;
	label: string;
	children: React.ReactNode;
	selectedId: string;
}

export interface SliderMenuItemProps {
	value: number;
	id: string;
	onChange?: (value: number[]) => void;
	selectedId: string;
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
	downloadSpeed: number;
	uploadSpeed: number;
	method: string;
	width: number;
	height: number;
	time: number;
	date: string;
}

export interface TransferColorAttempt {
	latency: number;
	downloadSpeed: number;
	uploadSpeed: number;
	width: number;
	height: number;
	time: number;
	targetSize: { width: number; height: number };
	referenceSize: { width: number; height: number };
	timeTaken: number;
	type: "WASM" | "NATIVE";
}

export interface BenchmarkTestProps {
	runSpeedTest: () => void;
	isFinished: boolean;
	error: string | null;
	isLoading: boolean;
	resultSpeed?: SpeedTestResult;
	windowSize?: { width: number; height: number };
	testAttempts: TestAttemptsProps;
	type: "wasm" | "native";
	submitResult: () => void;
	startBenchmark: boolean;
	useLatency: boolean;
	changeUseLatency: () => void;
	setStartBenchmark: (value: boolean) => void;
}

export interface TestAttemptsProps {
	colorTransfer: number;
	sharpness: number;
	saturation: number;
	temperature: number;
	tint: number;
	exposure: number;
	contrast: number;
}