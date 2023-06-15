import "./style.scss";
import React, { useMemo, useRef } from "react";
import Grow from "@mui/material/Fade";
import zoomPlugin from "chartjs-plugin-zoom";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

// @ts-ignore
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Check if color has good contrast with bright backgrounds
    if (r * 0.299 + g * 0.587 + b * 0.114 > 146) {
        return "rgba(" + r + "," + g + "," + b + "," + 0.8 + ")";
    }
    // If not, try again
    return getRandomColor();
};

interface iChartProps {
    label: string;
    values: number[];
    unit?: string;
}

const CustomChart = ({ label, values, unit, transition }: iChartProps & { transition?: number }) => {
    const chartRef = useRef<any>(null);

    ChartJS.register(zoomPlugin, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

    const preparedData: { x: number; y: number }[] = useMemo(() => {
        return values.map((value, index) => {
            return {
                x: index,
                y: value,
            };
        });
    }, [values]);

    const datasetColor = useMemo(() => getRandomColor(), []);

    const chartData = {
        labels: preparedData.map((item) => item.x),
        datasets: [
            {
                label: label,
                data: preparedData.map((data) => data.y),
                borderWidth: 1,
                borderColor: datasetColor,
                backgroundColor: datasetColor,
                fill: false,
                pointRadius: 2,
            },
        ],
    };

    const dataMinMax = preparedData.reduce(
        (acc, item) => {
            if (acc.min > item.y) {
                acc.min = item.y;
            }
            if (acc.max < item.y) {
                acc.max = item.y;
            }
            return acc;
        },
        { min: 100, max: 0 },
    );

    const options = {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: false,
                max: Math.ceil(dataMinMax.max + 5).toFixed(1),
                min: Math.floor(dataMinMax.min - 5).toFixed(1),
                ticks: {
                    callback: (value: number) => `${parseInt(String(value)).toFixed(1)}${unit}`,
                },
            },
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: "xy",
                },
                limits: {
                    x: {
                        min: 0,
                    },
                    y: {
                        min: Math.floor(dataMinMax.min - 25).toFixed(1),
                        max: Math.ceil(dataMinMax.max + 25).toFixed(1),
                    },
                },
                zoom: {
                    speed: 0.05,
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: false,
                    },
                    mode: "y",
                },
            },
        },
    };

    return (
        <Grow in unmountOnExit timeout={transition} style={{ width: "100%" }}>
            <div className="CustomChart">
                {/*@ts-ignore*/}
                <Line data={chartData} options={options} ref={chartRef} />
                <button className="CustomChart__resetZoom" onClick={() => chartRef.current.resetZoom()}>
                    Reset zoom
                </button>
            </div>
        </Grow>
    );
};

export default React.memo(CustomChart);
