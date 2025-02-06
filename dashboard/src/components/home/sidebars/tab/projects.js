import "../css/sidebar2.css";
import "./css/projects.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Coastguard } from "coast-guard";
import { credentials_object } from "@/pages/global";
import Button_with_icon from "@/components/button/image/button_with_icon";
import Link from "next/link";
import ToolTip from "@/components/miscellaneous/tooltip";
import Loading from "@/components/navigating/in-progress/loading";
import LoadingSpinner from "@/components/miscellaneous/loadingspinner";

export default function Sidebar2_projects(props) {
    const expanded = false;
    const router = useRouter();
    const [org, set_org] = useState(null);
    const [project, set_project] = useState(null);

    async function get_orgs() {
        const data = await Coastguard(await credentials_object(router, { cache: "reload" })).org.list();
        set_org(data.data);
        await sessionStorage.setItem("org", JSON.stringify(data.data));
    }

    async function get_projects() {
        const data = await Coastguard(await credentials_object(router, { cache: "reload" })).project.list();
        set_project(data.data);
        await sessionStorage.setItem("project", JSON.stringify(data.data));
    }

    const should_run = useRef(true);
    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;

        if (sessionStorage.getItem("org")) {
            set_org(JSON.parse(sessionStorage.getItem("org")));
        }
        if (sessionStorage.getItem("project")) {
            set_project(JSON.parse(sessionStorage.getItem("project")));
        }
        
        get_orgs();
        get_projects();
    });

    const org_ul = (org != null ? org : []).map((data) => {
        const short_org_name = data.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();

        const name = expanded == true ? data.name : short_org_name;
        return (
            <ToolTip text={`${data.name}`}>
                <Link href={`/${data.id}`}>
                    <Button_with_icon icon={data.icon} className="width_100">
                        {expanded == true || !data.icon && <p>
                            {name}
                        </p>}
                    </Button_with_icon>
                </Link>
            </ToolTip>
        )
    });

    const projects_ul = (project != null ? project : []).map((data) => {
        const short_namespace_name = data.namespace.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
        const short_project_name = data.name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();

        const name = expanded == true ? `${data.namespace.name}/${data.name}` : `${short_namespace_name}/${short_project_name}`;
        return (
            <ToolTip text={`${data.namespace.name}/${data.name}`}>
                <Link href={`/${data.namespace.org.id}/${data.namespace.id}/${data.id}`}>
                    <Button_with_icon icon={data.icon} className="width_100">
                        {expanded == true || !data.icon && <p>
                            {name}
                        </p>}
                    </Button_with_icon>
                </Link>
            </ToolTip>
        )
    });

    const Sidebar_header = ((props) => {
        return (
            <div className="column row_gap_4">
                <p className="sidebar_header greyText">{props.header}</p>
                {props.children}
            </div>
        )
    })

    return (
        <div className="column row_gap_6">
            {/* Recently viewed */}
            {/* Orgs */}
            {org != null && <Sidebar_header header="Orgs">{org_ul}</Sidebar_header>}
            {org == null && <LoadingSpinner style={{ width: 10, height: 10 }}/>}

            {/* <div className="side_line"/> */}

            {org != null && <Sidebar_header header="Projects">{projects_ul}</Sidebar_header>}
            {project == null && <LoadingSpinner style={{ width: 10, height: 10 }}/>}
        </div>
    )
}