import React from 'react';
import './registration-style.css';
export default function AuthenticationPage() {
    return (
        <>
            <div className="box form">
                <div className="text">
                    <p><span className="highlight">Регистрация</span> / Вход</p>
                </div>
            </div>
            <div className="box form-1">
                <form className="form-content" action="path_to_your_processing_script" method="POST">
                    <div className="input-group">
                        <label htmlFor="email">Почта</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="username">Логин</label>
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div className="form-links">
                        <a href="#">Уже зарегистрированы?</a>
                        <a href="#">Вход</a>
                    </div>
                </form>
            </div>
        </>
    );
}
