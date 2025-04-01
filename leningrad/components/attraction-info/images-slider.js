import { useState } from 'react';
import './images-slider-style.css';

export default function Slider({ images, name }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => setCurrentIndex(prev => (prev + 1) % images.length);
    const prevImage = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    const isReversed = name === "После блокады";
    const containerClass = isReversed ? "period-slider-container reversed" : "period-slider-container";
    return (
        <div className={containerClass}>
            {isReversed ? (
                <>
                    <div className="image-wrapper reversed">
                        <img src={images[currentIndex]} alt="" className="period-image" />
                    </div>
                    <div className="period-title">
                        {name.split(' ').map((word, i) => (
                            <span key={i}>{word}</span>
                        ))}
                    </div>
                </>
            ) : ( 
                <>
                    <div className="period-title">
                        {name.split(' ').map((word, i) => (
                            <span key={i}>{word}</span>
                        ))}
                    </div>
                    <div className="image-wrapper">
                        <img src={images[currentIndex]} alt="" className="period-image" />
                    </div>
                </>
            )}


            {images.length > 1 && (
                <div className="slider-navigation">
                    <button className="nav-arrow" onClick={prevImage} disabled={images.length <= 1}>
                        &lt;
                    </button>

                    <span className="image-counter">
                        {currentIndex + 1} из {images.length}
                    </span>

                    <button className="nav-arrow" onClick={nextImage} disabled={images.length <= 1}>
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
}