import "./time-period-section-style.css"
import Slider from "@/components/attraction-info/images-slider";

export default function TimePeriodSection({ section }) {
    return (
    <section>
        <h2 className="time-period-section-header">{section.name}</h2>
        <Slider images={section.image} />
        <p className="time-period-section-paragraph">{section.description}</p>
    </section>
    )
}