import "./to-go-button-style.css"
import { useRouter } from "next/navigation"

export default function ToGoButton({ attractionId }) {
    const router = useRouter();
    const handleClick = () => {
        localStorage.setItem('selectedMarkerId', attractionId); // Сохраняем id
        router.push('/map'); // URL останется чистым
    }
    return (

        <button className="to-go-button" onClick={handleClick}>
            <svg className="to-go-button-image" viewBox="0 0 89 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M44.0453 81.1793C44.0453 81.1793 71.5896 56.3068 71.5896 37.6524C71.5896 22.1987 59.2576 9.6709 44.0453 9.6709C28.833 9.6709 16.501 22.1987 16.501 37.6524C16.501 56.3068 44.0453 81.1793 44.0453 81.1793Z"
                    stroke="#0B83D9" strokeWidth="2.7933" />
                <path
                    d="M52.8453 36.4871C52.8453 41.4237 48.9059 45.4257 44.0464 45.4257C39.1869 45.4257 35.2475 41.4237 35.2475 36.4871C35.2475 31.5505 39.1869 27.5486 44.0464 27.5486C48.9059 27.5486 52.8453 31.5505 52.8453 36.4871Z"
                    stroke="#0B83D9" strokeWidth="2.7933" />
            </svg>
            <span>
                На карте
            </span>
        </button>
    )
}