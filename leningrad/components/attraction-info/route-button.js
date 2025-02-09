import "./route-button-style.css"

export default function RouteButton() {
    return(
        <button className="route-button">
            <svg className="route-button-image" viewBox="0 0 31 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M3.54405 62.4668C14.2193 60.9796 41.7492 48.7192 19.0376 34.7697C-3.67396 20.8202 -4.50712 4.98422 26.6987 2.62254"
                    stroke="#0B83D9" strokeWidth="2.7933"/>
                <ellipse cx="27.9014" cy="2.54813" rx="1.82482" ry="1.49789"
                         transform="rotate(-90.9852 27.9014 2.54813)" fill="#0B83D9"/>
                <ellipse cx="2.81932" cy="62.4251" rx="1.82482" ry="1.49789"
                         transform="rotate(-90.9852 2.81932 62.4251)" fill="#0B83D9"/>
            </svg>
            <span>
                Маршруты
            </span>
        </button>
    )
}