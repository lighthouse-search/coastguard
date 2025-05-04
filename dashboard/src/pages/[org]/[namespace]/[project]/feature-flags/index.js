import './css/issues.css';
import '@/../styles/global.css';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Rows_backdrop_row1 from "@/components/rows/backdrop/rows/rows-backdrop-row1";
import Profile_pics from '@/components/user/profile_pics';
import Button_with_icon from '@/components/button/image/button_with_icon';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Coastguard } from 'coast-guard';
import { credentials_object, get_prepend } from '@/pages/global';
import Loading from '@/components/navigating/in-progress/loading';

export default function Issues() {
    const [tab, set_tab] = useState("events");
    const [feature_flags, set_feature_flags] = useState(null);
    const [event, set_event] = useState(null);
    const [discussion, set_discussion] = useState(null);

    const router = useRouter();
    const should_run = useRef(true);

    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;

        run();
    });

    async function run() {
        const data = await Coastguard(await credentials_object(router)).issue.list();
        if (data.data[0] && data.data[0].not_found == true) {
            alert("404");
            return;
        }
        const issues_v = data.data;
        set_feature_flags(issues_v);
    }
    
    const Sub_children = ((props) => {
        return (
            <div className='sub_children greyText'>
                {/* TODO: / NOTE TO SELF: The way we'll know which services are involved in an error is allowing admins to check if a specific API (such as an SQL library) was called in the error logs. */}
                <p href="https://example.com" className='greyText'>bool</p>
                <p>•</p>
                <p href="https://example.com" className='greyText'>240,981/310,145 checks</p>
            </div>
        )
    });

    if (feature_flags == null) {
        return (
            <Home1 header="Issues">
                <Loading/>
            </Home1>
        )
    }

    const feature_flags_ul = feature_flags.map((data) => {
        return (
            <Rows_backdrop_row1 href={`${get_prepend(router)}/feature-flags/${data.id}`} icon={<p>true</p>} header={"trending_tab"} subchildren={<Sub_children data={data}/>} className="error_backdrop_row"/>
        )
    })
    
    return (
        <Home1 header="Feature flags">
            <div className='content_ul'>
                <div className='row space_between'>
                    <input placeholder="Search"/>
                    <Button_with_icon icon="/icons/plus.svg" href={`${get_prepend(router)}/feature-flags/create`}>Create</Button_with_icon>
                </div>

                {feature_flags_ul}
                {/* <p className='no_more_errors greyText'>No more errors! - you're safe... for now</p> */}
            </div>
        </Home1>
    )
}