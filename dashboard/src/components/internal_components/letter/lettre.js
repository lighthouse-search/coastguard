import "./css/lettre.css";
import "@/components/global.css";

export default function Lettre(props) {
    return (
        <div {...props} className={`lettre outline ${props.className}`}>
            {props.children}
        </div>
    )
}