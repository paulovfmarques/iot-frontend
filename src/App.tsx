import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { v4 as uuidv4 } from "uuid";
import { Layout, Main } from "./components";
import { iChartRawData, iDataState, iPreparedData } from "./@types";

function App() {
    const [chartData, setChartData] = useState<iDataState>({});
    const [shouldConnect, setShouldConnect] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<any>([]);

    const { lastJsonMessage, sendMessage } = useWebSocket(
        "wss://owmyj4aod8.execute-api.sa-east-1.amazonaws.com/dev",
        {
            onOpen: () => {
                setIsConnected(true);
                console.log(`Connected to App WS`);
            },
            onClose: () => {
                setIsConnected(false);
                console.log(`Disconnected from App WS`);
            },
            onMessage: () => {
                if (lastJsonMessage) {
                    const rawData = lastJsonMessage as unknown as iChartRawData;
                    const { type } = rawData;

                    if (type === "error") {
                        const { body } = rawData as any;
                        if (typeof body === "string") {
                            setError((prev: string[]) => [...new Set([...prev, body])]);
                        } else {
                            setError((prev: string[]) => [...new Set([...prev, JSON.stringify(body)])]);
                        }
                        return;
                    }

                    setError([]);

                    const obj: iDataState = {};
                    const {
                        body: { name, data },
                    } = rawData;

                    const chartDataEntries = Object.entries(chartData);

                    if (chartDataEntries.length === 0) {
                        setChartData({
                            [name]: data,
                        });
                    } else {
                        chartDataEntries.forEach(([key, value]) => {
                            if (key === name) {
                                obj[key] = [...value, ...data];
                            } else {
                                obj[key] = value;
                            }
                        });

                        setChartData(obj);
                    }
                }
            },
            queryParams: {
                clientType: "browser",
                deviceId: localStorage.getItem("deviceId") || "",
            },
            onError: (event) => {
                setError(
                    `Algo deu errado na conexão com o websocket.
                    Verifique se o API Gateway ID usado é consistente com o ID do seu API Gateway.`,
                );
                console.error(event);
            },
            shouldReconnect: () => {
                console.log("Reconnecting...");
                return true;
            },
            reconnectInterval: 3000,
        },
        shouldConnect,
    );

    useEffect(() => {
        const deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            localStorage.setItem("deviceId", uuidv4());
        }
    }, []);

    const preparedData: iPreparedData = Object.entries(chartData).reduce((acc, [key, value]) => {
        const obj: any = {};
        value.forEach((item) => {
            if (!obj[item.label]) {
                obj[item.label] = {
                    values: [item.value],
                    unit: item.unit,
                };
            } else {
                obj[item.label].values.push(item.value);
            }
        });
        acc[key] = obj;
        return acc;
    }, {} as any);

    const handleConnection = () => {
        setShouldConnect(!shouldConnect);
    };

    const handleClearData = () => {
        setChartData({});
    };

    return (
        <Layout>
            <Main
                error={error}
                data={preparedData}
                shouldConnect={shouldConnect}
                isConnected={isConnected}
                handleConnection={handleConnection}
                handleClearData={handleClearData}
            />
        </Layout>
    );
}

export default App;
