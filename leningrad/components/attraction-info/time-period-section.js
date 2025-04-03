import "./time-period-section-style.css"
import Slider from "@/components/attraction-info/images-slider";

export default function TimePeriodSection({ section, routes, isMobile }) {
    return isMobile ? (
        <>
            <div className="time-period-container">
                <section className="time-period-section">
                    <Slider images={section.image} name={section.name} isMobile={isMobile} />
                    <p className="time-period-section-paragraph">{section.description}</p>
                </section>
            </div>
        </>
    ) : (
        <div className="time-period-container">
            <section className="time-period-section">
                <Slider images={section.image} name={section.name} isMobile={isMobile} />
                <p className="time-period-section-paragraph">{section.description}</p>
            </section>

            {section.name === 'До блокады' && (
                <>
                    <div className="pop">
                        <hr className="routes-line" />
                        <div className="routes-label">Маршруты</div>
                        <hr className="routes-line" />
                        {routes.map((route) => (
                            <div key={route.id} className="route-item">
                                <img src={route.image} alt={route.name} className="route-image" />
                                <a href="/routes" className="route-name">{route.name}</a>
                            </div>
                        ))}

                    </div>
                </>
            )}
        </div>
    )
}