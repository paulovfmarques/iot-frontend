export interface iChartData {
	label: string;
	value: string | number;
	unit: string;
}

export interface iChartRawData {
	action: string;
	body: {
		name: string;
		data: iChartData[];
	};
	type: string;
}

export interface iDataState {
	[k: string]: iChartData[];
}

export interface iPreparedData {
	[k: string]: {
		[k: string]: {
			values: number[];
			unit: string;
		};
	};
}