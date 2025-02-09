import "./button-panel-style.css"
import HeartButton from "@/components/attraction-info/heart-button";
import ToGoButton from "@/components/attraction-info/to-go-button";
import RouteButton from "@/components/attraction-info/route-button";

export default function ButtonPanel() {
    return(
    <div className="button-panel">
        <HeartButton/>
        <RouteButton/>
        <ToGoButton/>
    </div>
    )
}