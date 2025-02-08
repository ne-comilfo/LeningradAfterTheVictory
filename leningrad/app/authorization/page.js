import React from 'react';
import './style.css';

export default function AuthorizationPage()
{
    const backgroundTransition = React.createElement("div", {className: "transition"});
    const enterText = React.createElement("div", {className: "enter_style"}, "Вход");
    const regText = React.createElement("div", {className: "reg_style"}, " / Регистрация");
    const enterSign = React.createElement("div", {className: "input_border1"}, enterText, regText);

    const loginEmailLabelUnformatted = React.createElement("p", {className: "input_label"}, "Логин / почта");
    const passwordLabelUnformatted = React.createElement("p", {className: "input_label"}, "Пароль");
    const loginEmailLabel = React.createElement("div", {className: "input_left"}, loginEmailLabelUnformatted);
    const passwordLabel = React.createElement("div", {className: "input_left"}, passwordLabelUnformatted);

    const loginEmailInputboxUnformated = React.createElement("input", {type: "text", className: "input_text"});
    const passwordInputboxUnformated = React.createElement("input", {type: "password", className: "input_text"});
    const loginEmailInputbox = React.createElement("div", {className: "input_center"}, loginEmailInputboxUnformated);
    const passwordInputbox = React.createElement("div", {className: "input_center"}, passwordInputboxUnformated);

    const registrationHyperlink1 = React.createElement("a", {className: "hyper_register", href:"itmo.ru"}, "Ещё не зарегистрированы?");
    const registrationHyperlink2 = React.createElement("a", {className: "hyper_register", href:"itmo.ru"}, "Регистрация");

    const inputPart = React.createElement("div", {className: "input_piece"}, loginEmailLabel, loginEmailInputbox, passwordLabel, passwordInputbox)
    const hyperPart = React.createElement("div", {className: "caution_buttons"}, registrationHyperlink1, registrationHyperlink2);
    const inputBlock = React.createElement("div", {className: "input_border2"}, inputPart, hyperPart);

    const authenticationBlocks = React.createElement("div", {className: "enter_sign"}, enterSign, inputBlock);
    const authenticationPage = React.createElement("div", {className: "result_page"}, backgroundTransition, authenticationBlocks);
    
    return authenticationPage;
}