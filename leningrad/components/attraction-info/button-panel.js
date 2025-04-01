import "./button-panel-style.css"
import HeartButton from "@/components/attraction-info/heart-button";
import ToGoButton from "@/components/attraction-info/to-go-button";

export default function ButtonPanel({ attractionId}) {
    return(
    <div className="button-panel">
        <HeartButton/>
        <ToGoButton attractionId={attractionId} />
    </div>
    )
}