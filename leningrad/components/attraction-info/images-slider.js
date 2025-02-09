import { useState } from "react";
import "./images-slider-style.css";

export default function Slider({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    const showArrows = images.length > 1;

    return (
        <div className="slider-container">
            {showArrows && (<button className="slider-button left" onClick={prevImage}>
                &lt;
            </button>
            )}

            <img
                src={images[currentIndex]}
                alt="картинка"
                className="time-period-section-image"
            />

            {showArrows && (<button className="slider-button right" onClick={nextImage}>
                &gt;
            </button>
            )}
        </div>
    );
};
