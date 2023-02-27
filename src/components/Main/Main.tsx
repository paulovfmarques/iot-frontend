import "./style.scss";
import React, { useState } from "react";
import Grow from "@mui/material/Grow";
import Fade from "@mui/material/Fade";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { AlertTriangle, Cpu, Loader, XSquare } from "react-feather";
import { CustomChart } from "../CustomChart";
import { iPreparedData } from "../../@types";

interface iMainProps {
    error: string[];
    data: iPreparedData;
    isConnected: boolean;
    shouldConnect: boolean;
    handleConnection: () => void;
    handleClearData: () => void;
}

const Main = ({error, data, isConnected, shouldConnect, handleConnection, handleClearData}: iMainProps) => {
    const [title, setTitle] = useState("");
    const [name, setName] = useState("");

    const hasData = Object.keys(data).length > 0;

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    return (
        <div className="Main__wrapper">
            <section className="Main__left">
                <div className="Main__form--wrapper">
                    <h1 className="Main__title">Informações</h1>
                    <input
                        className="Main__input"
                        placeholder="Título da coleta"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <input
                        className="Main__input"
                        placeholder="Nome do participante"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <div className="Main__divider"/>
                </div>

                {error.length > 0 && (
                    <div className="Main__error--wrapper">
                        {error.map((err: string, errIndex) => (
                            <Fade in={!!err} key={err + errIndex}>
                                <div className="Main__error">
                                    <XSquare size="16px"/>
                                    <p>{err}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                )}
            </section>

            <section className="Main__right">
                <div className="Main__right--buttonWrapper">
                    <Tippy content="Limpa todos os dados recebidos.">
                        <button disabled={isConnected || !hasData} onClick={handleClearData}>
                            Limpar tudo
                        </button>
                    </Tippy>

                    <button onClick={handleConnection}>{isConnected ? "Desconectar" : "Conectar"}</button>
                </div>

                {hasData &&
                    Object.entries(data).map(([sensorName, dataset], sensorIndex) => {
                        return (
                            <div className="Main__right--container" key={sensorName}>
                                <h2 key={sensorName}>{sensorName}</h2>
                                {Object.entries(dataset).map(([label, {values, unit}], dataIndex) => {
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

                <Grow in={!hasData && !isConnected && !(error.length > 0)} unmountOnExit timeout={300}>
                    <div className="Main__right--empty">
                        {shouldConnect ? (
                            <Loader size="5rem" color="#c1c1c1"/>
                        ) : (
                            <AlertTriangle size="5rem" color="#ff8f39"/>
                        )}
                        <em>{shouldConnect ? "Conectando..." : "Conecte - se para receber os dados"}</em>
                    </div>
                </Grow>

                {!hasData && isConnected && (
                    <div className="Main__right--empty Main__right-absolute">
                        <Cpu size="5rem" color="#c1c1c1"/>
                        <p>Aguardando dados do micro-controlador...</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Main;
