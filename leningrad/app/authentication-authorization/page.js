'use client'

import React, { useState, useRef } from "react";
import './authentication-authorization-style.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AuthContent = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const isFormValidRef = useRef(false);
  const buttonRef = useRef(null);
  const passwordErrorRef = useRef(null);

  const handleModeSwitch = (mode) => {
    setIsLoginMode(mode);
    setErrorMessage(""); // Очищаем ошибку при переключении формы
  };


  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/personal-account";

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    let url = "http://194.87.252.234:6060/api/authentication/token";
    let formData = { username: emailRef.current.value, password: passwordRef.current.value };

    if (!isLoginMode) {
      url = "http://194.87.252.234:6060/api/authentication/register";
      formData = { name: usernameRef.current.value, email: emailRef.current.value, password: passwordRef.current.value };
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (response.status === 422) {
        setErrorMessage(isLoginMode ? "Неправильные логин или пароль" : "Логин или почта уже используются");
        return;
      }
      
      if (!response.ok) throw new Error("Ошибка при отправке данных на сервер");

      if (!isLoginMode) {
      setIsLoginMode(true);
      setErrorMessage("");
    } else {
      // Если это вход, перенаправляем на целевую страницу
      router.push(redirectPath);  // redirectPath может быть /personal-account или любой другой путь
    }
    } catch (error) {
      setErrorMessage("Ошибка соединения с сервером. Попробуйте позже.");
    }
  };

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
      const passwordValue = passwordRef.current?.value.trim();
      const passwordFilled = passwordValue.length > 0;

      // Обновляем текст ошибки через ref (без ререндера)
      if (passwordErrorRef.current) {
        passwordErrorRef.current.textContent =
          passwordFilled && passwordValue.length < 8 ? "Пароль должен содержать не менее 8 символов" : "";
      }

      const isValid = emailFilled && usernameFilled && passwordFilled && passwordValue.length >= 8;
      if (isFormValidRef.current !== isValid) {
        isFormValidRef.current = isValid;
        if (buttonRef.current) {
          buttonRef.current.classList.toggle("active", isValid);
          buttonRef.current.disabled = !isValid;
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
        <span
          className={isLoginMode ? "highlight" : ""}
          onClick={() => handleModeSwitch(true)} // Вызываем с очисткой ошибки
        >
          Вход
        </span> / <span
          className={!isLoginMode ? "highlight" : ""}
          onClick={() => handleModeSwitch(false)} // Вызываем с очисткой ошибки
        >
          Регистрация
        </span>
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
        <p ref={passwordErrorRef} className="error-message"></p>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          ref={buttonRef}  // Добавляем реф
          className={`button ${isLoginMode ? "login" : "registration"}`}
          type="submit"
          disabled={!isFormValidRef.current}
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button
          ref={buttonRef}  // Добавляем реф
          className={`button ${isLoginMode ? "login" : "registration"}`}
          type="submit"
          disabled={!isFormValidRef.current}
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

const AuthenticationAuthorizationPage = () => {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <AuthContent />
    </Suspense>
  );
  
}

export default AuthenticationAuthorizationPage;
