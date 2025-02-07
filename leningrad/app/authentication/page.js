import React from 'react';
import './registration-style.css';

const FormHeader = () => (
    <div className="box form">
        <div className="text">
            <p><span className="highlight">Регистрация</span> / Вход</p>
        </div>
    </div>
);

const InputField = ({ label, type, id, name }) => (
    <div className="input-group">
        <label htmlFor={id}><span className='qw'>{label}</span></label>
        <input type={type} id={id} name={name} required />
    </div>
);

const FormLinks = () => (
    <div className="form-links">
        <a href="#">Уже зарегистрированы?</a>
        <a href="#">Вход</a>
    </div>
);

const RegistrationForm = () => (
    <div className="box form-1">
        <form className="form-content" action="path_to_your_processing_script" method="POST">
            <InputField label="Почта" type="email" id="email" name="email" />
            <InputField label="Логин" type="text" id="username" name="username" />
            <InputField label="Пароль" type="password" id="password" name="password" />
            <FormLinks />
        </form>
    </div>
);

export default function AuthenticationPage() {
    return (
        <>
            <FormHeader />
            <RegistrationForm />
        </>
    );
}
