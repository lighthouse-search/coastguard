import Base from "../base";
import Sidebar2 from "./sidebars/sidebar2";
import './../global.css';
import "./css/home.css"
import Layout_Topbar from "../layout/layout_topbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { Coastguard } from "coast-guard";
import { credentials_object } from "@/pages/global";
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../miscellaneous/loadingspinner";
import Button_with_icon from "../button/image/button_with_icon";

export default function Home1(props) {
    const router = useRouter();

    const should_run = useRef(true);
    const [org, set_org] = useState(null);
    const [namespace, set_namespace] = useState(null);
    const [project, set_project] = useState(null);

    async function metadata() {
        if (router.query.project) {
            const project_v = await Coastguard(await credentials_object(router)).project.list([router.query.project]);
            set_project(project_v.data[0]);
            set_namespace(project_v.data[0].namespace);
            set_org(project_v.data[0].namespace.org);
        } else if (router.query.namespace) {
            const namespace_v = await Coastguard(await credentials_object(router)).namespace.list([router.query.namespace]);
            set_namespace(namespace_v.data[0]);
            set_org(namespace_v.data[0].org);
        } else if (router.query.org) {
            const org_v = await Coastguard(await credentials_object(router)).org.list([router.query.org]);
            set_org(org_v.data[0]);
        }
    }

    useEffect(() => {
        if (should_run.current != true || (!router.query.project && !router.query.namespace && !router.query.org)) { return; }
        should_run.current = false;

        metadata();
    });

    const Nameplate = ((props) => {
        // return <Switcher side="right" header={props.header}/>;

        return (
            <div className="org_namespace_prg_nameplate row">
                <img src={props.icon}/>
                {/* <Switcher side="right" header={props.header}/> */}
                <Link href={props.href}>{props.header}</Link>
            </div>
        )
    });

    const Topbar_item = ((props) => {
        return (
            <div className="row column_gap_4">
                <p>/</p>
                {props.data && props.children}
                {!props.data && <LoadingSpinner style={{ width: 10, height: 10 }}/>}
            </div>
        )
    })

    const Topbar = (() => {
        const prepend = (project ? `/${project.namespace.org.id}/${project.namespace.id}/${project.id}` : "");

        let headers_prepend = [];

        // If header is string, convert it to array.
        const header_convert = (Array.isArray(props.header) == true ? props.header : [props.header]);
        
        const headers = (props.header && props.header != true ? header_convert : []).map((header) => {
            headers_prepend.push(header.toLowerCase());

            return (
                <div className="row column_gap_4">
                    <p>/</p>
                    <Link href={prepend+"/"+headers_prepend.join("/")}>{header}</Link>
                </div>
            )
        })

        return (
            <Layout_Topbar className="home1_topbar" style={{ paddingLeft: 8 }}>
                <Link href={"/home"}>Home</Link>

                {org && <Topbar_item data={org}>
                    <Nameplate href={`/${org.id}`} icon={org.icon} header={org.name}/>
                </Topbar_item>}
                
                {namespace && <Topbar_item data={namespace}>
                    <Nameplate href={`/${namespace.org.id}/${namespace.id}`} icon={namespace.icon} header={namespace.name}/>
                </Topbar_item>}
                
                {project && <Topbar_item data={project}>
                    <Nameplate href={`/${project.namespace.org.id}/${project.namespace.id}/${project.id}`} icon={project.icon} header={project.name}/>
                </Topbar_item>}
                
                {headers}
            </Layout_Topbar>
        )
    });

    return (
        <Base className="home1">
            <div className="home1_content">
                <Sidebar2/>
                <div className={`home1_children ${props.nonpadded_children_className}`}>
                    {(props.header != null || props.header == true) && <Topbar/>}
                    <div style={props.style} className={`home1_children_content ${props.className}`}>
                        {/* <div className="home1_children_content_top">
                            {props.header && <h1 className="page_header">{props.header}</h1>}
                        </div> */}
                        {props.children}
                    </div>
                </div>
            </div>
        </Base>
    )
}