import "./style.scss";
import React, { useState } from "react";
import Grow from "@mui/material/Grow";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { AlertTriangle, Cpu, Loader, XSquare } from "react-feather";
import { CustomChart } from "../CustomChart";
import { iPreparedData } from "../../@types";

interface iMainProps {
    toggleLedState: () => void;
    ledState: { ledPin?: number; state?: "on" | "off" };
    data: iPreparedData;
    isConnected: boolean;
    shouldConnect: boolean;
    handleConnection: () => void;
    handleClearData: () => void;
}

const Main = ({
    ledState,
    data,
    toggleLedState,
    isConnected,
    shouldConnect,
    handleConnection,
    handleClearData,
}: iMainProps) => {
    const hasData = Object.keys(data).length > 0;

    return (
        <div className="Main__wrapper">
            <section className="Main__right">
                <div className="Main__right--buttonWrapper">
                    <Tippy content="Limpa todos os dados recebidos.">
                        <button disabled={isConnected || !hasData} onClick={handleClearData}>
                            Limpar tudo
                        </button>
                    </Tippy>

                    <button onClick={handleConnection}>{isConnected ? "Desconectar" : "Conectar"}</button>
                </div>

                {hasData && (
                    <div className="Main__right--ledContainer">
                        <code>Ligar/Desligar LED: </code>
                        <div>
                            {ledState.state === "on" ? (
                                <RadioButtonCheckedIcon
                                    onClick={toggleLedState}
                                    style={{ color: "lightgreen", fontSize: "3rem", cursor: "pointer" }}
                                />
                            ) : (
                                <RadioButtonUncheckedIcon
                                    onClick={toggleLedState}
                                    style={{ fontSize: "3rem", cursor: "pointer" }}
                                />
                            )}
                        </div>
                    </div>
                )}

                {hasData &&
                    Object.entries(data).map(([sensorName, dataset], sensorIndex) => {
                        return (
                            <div className="Main__right--container" key={sensorName}>
                                <h2 key={sensorName}>{sensorName}</h2>
                                {Object.entries(dataset).map(([label, { values, unit }], dataIndex) => {
                                    return (
                                        <CustomChart
                                            key={label + dataIndex + sensorIndex}
                                            label={label}
                                            unit={unit}
                                            values={values}
                                            transition={(sensorIndex + dataIndex + 1) * 1000}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                <Grow in={!hasData && !isConnected} unmountOnExit timeout={300}>
                    <div className="Main__right--empty">
                        {shouldConnect ? (
                            <Loader size="5rem" color="#c1c1c1" />
                        ) : (
                            <AlertTriangle size="5rem" color="#ff8f39" />
                        )}
                        <em>{shouldConnect ? "Conectando..." : "Conecte - se para receber os dados"}</em>
                    </div>
                </Grow>
                {!hasData && isConnected && (
                    <div className="Main__right--empty Main__right-absolute">
                        <Cpu size="5rem" color="#c1c1c1" />
                        <p>Aguardando dados do micro-controlador...</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Main;
