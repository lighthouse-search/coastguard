import "./css/lettre_header.css";

export default function Lettre_header(props) {
    return (
        <div className="lettre_component">
            <h3>{props.header}</h3>
            <div className="lettre_component_content">
                {props.children}
            </div>
        </div>
    )
}