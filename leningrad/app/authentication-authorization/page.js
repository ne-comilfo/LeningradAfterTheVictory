'use client'

import React, { useState, useRef } from "react";
import './authentication-authorization-style.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthenticationAuthorizationPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const isFormValidRef = useRef(false);
  const buttonRef = useRef(null);



  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    let url = "http://194.87.252.234:6060/api/authentication/token";
    let formData = {
      username: emailRef.current.value,
      password: passwordRef.current.value,
    };

    if (!isLoginMode) {
      url = "http://194.87.252.234:6060/api/authentication/register";
      formData = {
        name: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.status === 422) {
        setErrorMessage(isLoginMode ? "Неправильные логин или пароль" : "Логин или почта уже используются");
        return;
      }

      if (!response.ok) {
        throw new Error("Ошибка при отправке данных на сервер");
      }

      window.location.href = "/personal-account"; // Перенаправление при успехе
    } catch (error) {
      setErrorMessage("Ошибка соединения с сервером. Попробуйте позже.");
      console.error("Ошибка:", error);
    }
  };


  const BackgroundTransition = () => (
    <div className="background-transition" />
  );

  const InputField = ({ label, type, id, name, ref, isLoginMode }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isValueVisible, setIsValueVisible] = useState(false);

    const handleInputChange = (e) => {
      setIsValueVisible(e.target.value.length > 0);
      handleChange();
    };


    const handleChange = () => {
      const emailFilled = emailRef.current?.value.trim().length > 0;
      const usernameFilled = isLoginMode ? true : usernameRef.current?.value.trim().length > 0;
      const passwordFilled = passwordRef.current?.value.trim().length > 0;

      const isValid = emailFilled && usernameFilled && passwordFilled;

      if (isFormValidRef.current !== isValid) {
        isFormValidRef.current = isValid;

        // 🚀 ОБНОВЛЯЕМ ТОЛЬКО КНОПКУ (никакого ререндера формы)
        if (buttonRef.current) {
          buttonRef.current.classList.toggle("active", isValid);
        }
      }
    };



    return (

      <div className="input-group">
        <div className="input-wrapper">
          <label htmlFor={id}><span className='qw'>{label}</span></label>

          <input
            type={type === "password" && showPassword ? "text" : type}
            id={id}
            name={name}
            ref={ref}
            onChange={handleInputChange}
            required
          />

          {type === "password" && isValueVisible && (
            <span className={`eye-icon ${isLoginMode ? "login" : "registration"}`} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </span>
          )}

        </div>
      </div>

    );
  };

  const FormHeader = ({ isLoginMode, setIsLoginMode }) => (
    <div className="text">
      <p>
        <span className={isLoginMode ? "highlight" : ""} onClick={() => setIsLoginMode(true)}>Вход</span> /
        <span className={!isLoginMode ? "highlight" : ""} onClick={() => setIsLoginMode(false)}> Регистрация</span>
      </p>
    </div>
  );

  const RegistrationForm = ({ isLoginMode, setIsLoginMode, emailRef, usernameRef, passwordRef, handleFormSubmit }) => (
    <div className="box form-1">
      <FormHeader isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode} />
      <form className="form-content registration" method="POST" onSubmit={handleFormSubmit}>
        <InputField label="Почта" type="email" id="email" ref={emailRef} isLoginMode={isLoginMode} />
        <InputField label="Логин" type="text" id="username" ref={usernameRef} isLoginMode={isLoginMode} />
        <InputField label="Пароль" type="password" id="password" ref={passwordRef} isLoginMode={isLoginMode} />

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          ref={buttonRef}  // Добавляем реф
          className={`button ${isLoginMode ? "login" : "registration"}`}
          type="submit"
        >
          {isLoginMode ? "Войти" : "Зарегистрироваться"}
        </button>


      </form>
    </div>
  );

  const LoginForm = ({ isLoginMode, setIsLoginMode, emailRef, passwordRef, handleFormSubmit }) => (
    <div className="box form-1">
      <FormHeader isLoginMode={isLoginMode} setIsLoginMode={setIsLoginMode} />
      <form className="form-content login" method="POST" onSubmit={handleFormSubmit}>
        <InputField label="Логин/Почта" type="text" id="email" ref={emailRef} isLoginMode={isLoginMode} />
        <InputField label="Пароль" type="password" id="password" ref={passwordRef} isLoginMode={isLoginMode} />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <a
          className='forgot-password'
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setForgotPassword(true);
          }}
        >
          Забыли пароль?
        </a>
        <button
          ref={buttonRef}  // Добавляем реф
          className={`button ${isLoginMode ? "login" : "registration"}`}
          type="submit"
        >
          {isLoginMode ? "Войти" : "Зарегистрироваться"}
        </button>

      </form>
    </div>
  );

  const BlockForms = ({ isLoginMode, setIsLoginMode, emailRef, usernameRef, passwordRef, handleFormSubmit }) => (
    <div className="block-of-forms">
      <BackgroundTransition />
      {isLoginMode ? (
        <LoginForm
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
          emailRef={emailRef}
          passwordRef={passwordRef}
          handleFormSubmit={handleFormSubmit}
        />
      ) : (
        <RegistrationForm
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
          emailRef={emailRef}
          usernameRef={usernameRef}
          passwordRef={passwordRef}
          handleFormSubmit={handleFormSubmit}
        />
      )}
    </div>
  );

  if (forgotPassword) {
    return (
      <div className="forgot-password-message">
        Сервис временно не доступен
        <img src="/sad-smile.svg" className="smile" />
        <button onClick={() => setForgotPassword(false)}>Вернуться назад</button>
      </div>
    );
  }

  return (
    <div>
      <BlockForms
        isLoginMode={isLoginMode}
        setIsLoginMode={setIsLoginMode}
        emailRef={emailRef}
        usernameRef={usernameRef}
        passwordRef={passwordRef}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default AuthenticationAuthorizationPage;
