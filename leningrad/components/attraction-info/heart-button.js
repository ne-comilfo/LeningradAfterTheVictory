import "./heart-button-style.css"
import { useState } from 'react';

export default function HeartButton() {
    const [liked, setLiked] = useState(false);

    const handleClick = () => {
        setLiked(!liked);
    };

    return(
        <button className={`heart-button ${liked ? 'liked' : ''}`} onClick={handleClick}>
            <svg className="heart-button-image" viewBox="0 0 68 69" fill={liked ? "#0B83D9" : "none"} xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.8">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M11.1532 18.1309C13.6817 15.6032 17.1106 14.1832 20.6858 14.1832C24.2611 14.1832 27.6899 15.6032 30.2184 18.1309L34.1689 22.0781L38.1195 18.1309C39.3633 16.8431 40.8511 15.8159 42.4961 15.1093C44.1411 14.4027 45.9103 14.0307 47.7006 14.0152C49.4909 13.9996 51.2663 14.3407 52.9234 15.0187C54.5804 15.6966 56.0858 16.6978 57.3518 17.9638C58.6177 19.2297 59.6189 20.7352 60.2969 22.3922C60.9748 24.0492 61.3159 25.8247 61.3004 27.6149C61.2848 29.4052 60.9129 31.1745 60.2062 32.8195C59.4996 34.4645 58.4724 35.9523 57.1847 37.196L34.1689 60.2151L11.1532 37.196C8.62555 34.6676 7.20557 31.2387 7.20557 27.6635C7.20557 24.0882 8.62555 20.6594 11.1532 18.1309V18.1309Z"
                          stroke="#0B83D9" strokeWidth="2.7933" strokeLinejoin="round"/>
                </g>
            </svg>
            <span>
                {liked ? 'Сохранено' : 'Сохранить'}
            </span>
        </button>
    )
}