import React from "react";
import "./style.scss";
import { Header } from "../Header";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="Layout__wrapper">
            <Header title="Painel de Controle" />
            <main className="Layout__main">{children}</main>
        </div>
    );
};

export default Layout;
