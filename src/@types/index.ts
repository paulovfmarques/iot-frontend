export interface iChartData {
    label: string;
    value: string | number;
    unit: string;
}

export interface iChartRawData {
    action: "msg";
    type: "sensor" | "led_state" | "error";
    body: {
        name: string;
        data: iChartData[];
        ledPin: number;
        state: "on" | "off";
    };
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
