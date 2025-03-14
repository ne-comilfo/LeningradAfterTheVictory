'use client'

import React, { useState } from "react";
import './authentication-authorization-style.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthenticationAuthorizationPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const BackgroundTransition = () => (
    <div className="background-transition" />
  );

  const InputField = ({ label, type, id, name }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
    const handleInputChange = (e) => {
      if (type === "password") {
        setIsPasswordVisible(e.target.value.length > 0);
      }
    };
  
    return (
    <div className="input-group">
      <label htmlFor={id}><span className='qw'>{label}</span></label>
      
      <div className="input-wrapper">
        <input 
          type={type === "password" && showPassword ? "text" : type} 
          id={id} 
          name={name} 
          required 
          onChange={handleInputChange} 
        />
        {type === "password" && isPasswordVisible && (
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
          </span>
        )}
      </div>
    </div>
    );
  };
    
  const FormHeader = ({ isLoginMode }) => (
    <div className="box form">
      <div className="text">
        <p>
          <span className={!isLoginMode ? "highlight" : ""} onClick={() => setIsLoginMode(false)}>Регистрация</span> / 
          <span className={isLoginMode ? "highlight" : ""} onClick={() => setIsLoginMode(true)}>Вход</span>
        </p>
      </div>
    </div>
  );

  const FormLinks = ({ isLoginMode }) => (
    <div className="form-links">
      <a onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? "Ещё не зарегистрированы?" : "Уже зарегистрированы?"}
      </a>
      <a onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? "Регистрация" : "Вход"}
      </a>
    </div>
  );

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

  const LoginForm = () => (
    <div className="box form-1">
      <form className="form-content" action="path_to_your_processing_script" method="POST">
        <InputField label="Логин / почта" type="text" id="email" name="email" />
        <InputField label="Пароль" type="password" id="password" name="password" />
        <FormLinks isLoginMode={isLoginMode} />
      </form>
    </div>
  );

  const BlockForms = ({ isLoginMode }) => (
    <div className="block-of-forms">
      <BackgroundTransition />
      <FormHeader isLoginMode={isLoginMode} />
      {isLoginMode ? <LoginForm /> : <RegistrationForm />}
    </div>
  );

  return (
    <div>
      <BlockForms isLoginMode={isLoginMode} />
    </div>
  );
};

export default AuthenticationAuthorizationPage;
