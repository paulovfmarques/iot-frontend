import React, { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
import { Layout, Main } from "./components";
import { iChartRawData, iDataState, iPreparedData } from "./@types";

const WSS_URL = "wss://d441ny46de.execute-api.sa-east-1.amazonaws.com/dev";

function App() {
    const [ledState, setLedState] = useState({});
    const [chartData, setChartData] = useState<iDataState>({});
    const [shouldConnect, setShouldConnect] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const { lastJsonMessage, sendMessage } = useWebSocket(
        WSS_URL,
        {
            onOpen: () => {
                setIsConnected(true);
                toast(`Connected to websocket server`);
            },
            onClose: () => {
                setIsConnected(false);
                toast(`Disconnected from websocket server`, {
                    type: "warning",
                });
            },
            onMessage: () => {
                if (lastJsonMessage) {
                    const rawData = lastJsonMessage as unknown as iChartRawData;
                    const { type } = rawData;

                    if (type === "error") {
                        const { body } = rawData as any;
                        if (typeof body === "string") {
                            toast(body, { type: "error" });
                        } else {
                            toast(JSON.stringify(body), { type: "error" });
                        }
                        return;
                    }

                    const obj: iDataState = {};

                    if (rawData.type === "led_state") {
                        setLedState({
                            ledPin: rawData.body.ledPin,
                            state: rawData.body.state,
                        });
                        return;
                    }

                    const {
                        body: { name, data },
                    } = rawData;

                    const chartDataEntries = Object.entries(chartData);

                    if (chartDataEntries.length === 0) {
                        setChartData({
                            [name]: data,
                        });
                        return;
                    } else {
                        chartDataEntries.forEach(([key, value]) => {
                            if (key === name) {
                                obj[key] = [...value, ...data];
                            } else {
                                obj[key] = value;
                            }
                        });

                        setChartData(obj);
                        return;
                    }
                }
            },
            queryParams: {
                clientType: "browser",
                deviceId: localStorage.getItem("deviceId") || "",
            },
            onError: (event) => {
                toast("Algo deu errado na conexão com o websocket.", { type: "error" });
            },
            shouldReconnect: () => {
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

    const toggleLedState = () => {
        sendMessage(
            JSON.stringify({
                action: "msg",
                type: "toggle_led",
                ledPin: 15,
            }),
        );
    };

    return (
        <Layout>
            <Main
                toggleLedState={toggleLedState}
                ledState={ledState}
                data={preparedData}
                shouldConnect={shouldConnect}
                isConnected={isConnected}
                handleConnection={handleConnection}
                handleClearData={handleClearData}
            />
            <ToastContainer />
        </Layout>
    );
}

export default App;
