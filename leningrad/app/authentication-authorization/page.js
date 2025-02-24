import './authentication-authorization-style.css';

const BackgroundTransition = () => (
    <div className="background-transition" />
);

const InputField = ({ label, type, id, name }) => (
    <div className="input-group">
        <label htmlFor={id}><span className='qw'>{label}</span></label>
        <input type={type} id={id} name={name} required />
    </div>
);

const AuthenticationFormHeader = () => (
    <div className="box form">
        <div className="text">
            <p><span className="highlight">Регистрация</span> / <span className="switch" onClick={renderAuthorization}>Вход</span></p>
        </div>
    </div>
);

const AuthenticationFormLinks = () => (
    <div className="form-links">
        <a onClick={renderAuthorization}>Уже зарегистрированы?</a>
        <a onClick={renderAuthorization}>Вход</a>
    </div>
);

const AuthenticationRegistrationForm = () => (
    <div className="box form-1">
        <form className="form-content" action="path_to_your_processing_script" method="POST">
            <InputField label="Почта" type="email" id="email" name="email" />
            <InputField label="Логин" type="text" id="username" name="username" />
            <InputField label="Пароль" type="password" id="password" name="password" />
            <AuthenticationFormLinks />
        </form>
    </div>
);

const AuthenticationBlockForms = () => (
    <div className="block-of-forms">
        <BackgroundTransition />
        <AuthenticationFormHeader />
        <AuthenticationRegistrationForm />
    </div>
);

const AuthorizationFormHeader = () => (
    <div className="box form">
        <div className="text">
            <p><span className="highlight">Вход</span> / <span className="switch" onClick={renderAuthentication}>Регистрация</span></p>
        </div>
    </div>
);

const AuthorizationFormLinks = () => (
    <div className="form-links">
        <a onClick={renderAuthentication}>Ещё не зарегистрированы?</a>
        <a onClick={renderAuthentication}>Регистрация</a>
    </div>
);

const AuthorizationRegistrationForm = () => (
    <div className="box form-1">
        <form className="form-content" action="path_to_your_processing_script" method="POST">
            <InputField label="Логин / почта" type="text" id="email" name="email" />
            <InputField label="Пароль" type="password" id="password" name="password" />
            <AuthorizationFormLinks />
        </form>
    </div>
);

const AuthorizationBlockForms = () => (
    <div className="block-of-forms">
        <BackgroundTransition />
        <AuthorizationFormHeader />
        <AuthorizationRegistrationForm />
    </div>
);

function renderAuthentication() {
    return (
        <>
            <AuthenticationBlockForms />
        </>
    );
}

function renderAuthorization() {
    return (
        <>
            <AuthorizationBlockForms />
        </>
    );
}

export default function AuthenticationAuthorizationPage() {
    const container = document.getElementById("container12");
    const root = ReactDOM.createRoot(container);
    return (
        <>
            <AuthorizationBlockForms />
        </>
    );
}