import HoverFrame from "../miscellaneous/hover_frame";
import "./css/profile_pic.css";
import './../global.css';
import Link from "next/link";

export default function ProfilePic(props) {
    const Content = (() => {
        return (
            <button {...props} style={props.style} className={`profile_pic ${props.className}`}>
                <img src={props.src}/>
                {/* <div className="online_indicator"/> */}
            </button>
        )
    });
    if (props.href) {
        return (
            <Link href={props.href}>
                <Content/>
            </Link>
        )
    }
    return (
        <Content/>
    )
}