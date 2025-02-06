import "../css/sidebar2.css";
import "./css/project.css";
import SidebarButton1 from "../sidebar-buttons/sidebarbutton1";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Coastguard } from "coast-guard";
import { credentials_object, get_first_letters } from "@/pages/global";
import Button_with_icon from "@/components/button/image/button_with_icon";

export default function Sidebar2_project(props) {
    const router = useRouter();
    const [project, set_project] = useState(null);
    const expanded = true;

    async function get_projects() {
        const data = await Coastguard(await credentials_object(router, { cache: "reload" })).project.list([router.query.project]);
        set_project(data.data[0]);
    }

    const should_run = useRef(true);
    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;
        
        get_projects();
    });

    const prepend = router.query.project != null ? `/${router.query.org}/${router.query.namespace}/${router.query.project}` : "";

    function go_back() {
        if (router.query.project) {
            // org / namespace / project
            return `/${router.query.org}/${router.query.namespace}`;
        } else if (router.query.namespace) {
            // org / namespace
            return `/${router.query.org}`;
        } else if (router.query.org) {
            return "/home";
        }
    }
    return (
        <div className="column row_gap_10">
            {/* <Button_with_icon onClick={() => { router.push(go_back()) }} icon="/icons/arrow-left.svg"/> */}
            {/* icon={project && project.icon ? project.icon : "/icons/info.svg"} */}
            
            <div className="column row_gap_8">
                <SidebarButton1 href={prepend} alias={project ? project.name : "Project"} icon={project && project.icon && project.icon != "/default-pfp.png" ? project.icon : null}>
                    {expanded == true && (project && project.name ? get_first_letters(project.name).toUpperCase() : "")}
                </SidebarButton1>
                <SidebarButton1 alias="Events" href={prepend+"/event"} icon="/icons/events.svg"/>
                <SidebarButton1 alias="Errors" href={prepend+"/error"} icon="/icons/bomb.svg"/>
                <SidebarButton1 alias="Issues" href={prepend+"/bug"} icon="/icons/bug.svg"/>
                {/* Requests should probably just be built on an events search query endpoint. It doesn't need its own endpoint. */}
                <SidebarButton1 alias="Requests" href={prepend+"/request"} icon="/icons/traffic-light.svg"/>
                <SidebarButton1 alias="Timing" href={prepend+"/timing"} icon="/icons/timer.svg"/>
                <SidebarButton1 alias="Tests" href={prepend+"/test"} icon="/icons/test.svg"/>
                <SidebarButton1 alias="Feature flags" href={prepend+"/feature-flags"} icon="/icons/flag-outline.svg"/>
                {/* <SidebarButton1 alias="Settings" href="/settings" icon="/icons/settings.svg"/> */}
            </div>
        </div>
    )
}