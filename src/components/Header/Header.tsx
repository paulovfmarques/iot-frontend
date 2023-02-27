import React from "react";
import "./style.scss";
import logo from "../../assets/logo48px.svg";

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="Header">
            <div className="Header__wrapper">
                <img className="Header__logo" src={logo} alt="logo" width={42} height={42} />
                <h1 className="Header__title">{title}</h1>
            </div>
        </header>
    );
};

export default Header;
