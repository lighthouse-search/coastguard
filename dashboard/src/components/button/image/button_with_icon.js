import './css/button_with_icon.css';

export default function Button_with_icon(props) {
    return (
        <button {...props} className={`button_with_icon ${props.className}`}>
            {props.icon && props.side != "right" && typeof props.icon == "string" && <img className={props.icon_classname} src={props.icon}/>}
            {props.children}
            {props.icon && props.side == "right" && typeof props.icon == "string" && <img className={props.icon_classname} src={props.icon}/>}
        </button>
    )
}