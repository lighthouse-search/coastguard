import "./project.css";
import '@/../styles/global.css';
import "@/components/global.css";
import Button_with_icon from '@/components/button/image/button_with_icon';
import Home1 from "@/components/home/home";
import { Coastguard } from "coast-guard";
import { credentials_object } from "../../../global";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/navigating/in-progress/loading";

export default function Project() {
    const router = useRouter();
    const [project, set_project] = useState(null);
    const [loading, set_loading] = useState(true);

    async function get_project() {
        const project_v = await Coastguard(await credentials_object(router, { cache: "reload" })).project.list([router.query.project]);
        if (!project_v.data || !project_v.data[0] || project_v.data[0].not_found == true) {
            alert("404");
            return;
        }
        set_project(project_v.data[0]);
        set_loading(false);
    }

    const should_run = useRef(true);
    useEffect(() => {
        if (!router.query.project || should_run.current == router.query.project) { return; }
        should_run.current = router.query.project;
        
        get_project();
    });

    if (loading == true) {
        return <Home1 header={true}><Loading/></Home1>
    }

    return (
        <Home1 className="org" header={true}>
            {/* <div className="org_art disable-select">
                <img className="org_image" src={"https://plus.unsplash.com/premium_vector-1722003205986-66029405e6e2?q=80&w=3114&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
            </div> */}

            <div className="column org_content row_gap_8">
                <div className="column row_gap_6">
                    <div className="row space_between">
                        <div className='row org_metadata column_gap_8'>
                            <img className="icon" src={project.icon}/>
                            <div className="column column_gap_2">
                                <h2 className="org_title">{project.name}</h2>
                                <p className="org_sub greyText">Project</p> {/*• 2,000 members */}
                            </div>
                        </div>

                        <div className="row column_gap_8">
                            <Button_with_icon icon="/icons/settings.svg"></Button_with_icon>
                            <Button_with_icon icon="/icons/plus.svg">Join</Button_with_icon>
                        </div>
                    </div>

                    {/* <div className="side_line"/> */}

                    <div className="row column_gap_6">
                        {/* <button>Analytics</button> */}
                        <button>Members</button>
                    </div>
                </div>

                <div className="column row_gap_4">
                </div>
            </div>
        </Home1>
    )
}