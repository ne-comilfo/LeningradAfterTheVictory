'use client'

import React, { useState } from "react";
import './authentication-authorization-style.css';

const AuthenticationAuthorizationPage = () => {
  // Изменили начальное значение на true для формы входа
  const [isLoginMode, setIsLoginMode] = useState(true);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const BackgroundTransition = () => (
    <div className="background-transition" />
  );

  const InputField = ({ label, type, id, name }) => (
    <div className="input-group">
      <label htmlFor={id}><span className='qw'>{label}</span></label>
      <input type={type} id={id} name={name} required />
    </div>
  );

  // Обновили текст ссылок в заголовке
  const FormHeader = ({ isLoginMode }) => (
    <div className="box form">
      <div className="text">
        <p>
          <span className={isLoginMode ? "highlight" : ""} onClick={() => setIsLoginMode(true)}>Вход</span> / 
          <span className={!isLoginMode ? "highlight" : ""} onClick={() => setIsLoginMode(false)}>Регистрация</span>
        </p>
      </div>
    </div>
  );

  // Обновили текст ссылок
  const FormLinks = ({ isLoginMode }) => (
    <div className="form-links">
      <a onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? "Ещё не зарегистрированы?" : "Уже зарегистрированы?"}
      </a>
      <a onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? "Создать аккаунт" : "Войти в аккаунт"}
      </a>
    </div>
  );

  // Поменяли порядок рендеринга форм
  const BlockForms = ({ isLoginMode }) => (
    <div className="block-of-forms">
      <BackgroundTransition />
      <FormHeader isLoginMode={isLoginMode} />
      {isLoginMode ? <LoginForm /> : <RegistrationForm />}
    </div>
  );

  // Форма входа
  const LoginForm = () => (
    <div className="box form-1">
      <form className="form-content" action="path_to_your_processing_script" method="POST">
        <InputField label="Логин / почта" type="text" id="email" name="email" />
        <InputField label="Пароль" type="password" id="password" name="password" />
        <FormLinks isLoginMode={isLoginMode} />
      </form>
    </div>
  );

  // Форма регистрации
  const RegistrationForm = () => (
    <div className="box form-1">
      <form className="form-content" action="path_to_your_processing_script" method="POST">
        <InputField label="Почта" type="email" id="email" name="email" />
        <InputField label="Логин" type="text" id="username" name="username" />
        <InputField label="Пароль" type="password" id="password" name="password" />
        <FormLinks isLoginMode={isLoginMode} />
      </form>
    </div>
  );

  return (
    <div>
      <BlockForms isLoginMode={isLoginMode} />
    </div>
  );
};

export default AuthenticationAuthorizationPage;