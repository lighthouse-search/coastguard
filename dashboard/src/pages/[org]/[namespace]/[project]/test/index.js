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

export default function Tests() {
    const [tab, set_tab] = useState("events");
    const [issues, set_issues] = useState(null);
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
        set_issues(issues_v);
    }
    
    const Sub_children = ((props) => {
        return (
            <div className='sub_children greyText'>
                {/* TODO: / NOTE TO SELF: The way we'll know which services are involved in an error is allowing admins to check if a specific API (such as an SQL library) was called in the error logs. */}
                <p href="https://example.com" className='greyText'>API (staging), MariaDB (prod)</p>
                <p>•</p>
                <p href="https://example.com" className='greyText'>240,141 events</p>
                <p>•</p>
                <p href="https://example.com" className='greyText'>27-02-2024 (2h)</p>
            </div>
        )
    });

    const Header = ((props) => {
        const data = props.data;
        const authors = [
            {
                profile_pic: "https://cdn.bsky.app/img/avatar/plain/did:plc:wtdzzfgzjpirnk5wvpjutqoy/bafkreic5ffd2emwnoeyh5kwwipjrpdaizgbwvkcv45esphgyudvv3jimca@jpeg",
                name: "Josh"
            },
            {
                profile_pic: "/default-pfp.png",
                name: "John Doe"
            },
            {
                profile_pic: "/default-pfp.png",
                name: "John Doe"
            },
            {
                profile_pic: "/default-pfp.png",
                name: "John Doe"
            },
            {
                profile_pic: "/default-pfp.png",
                name: "John Doe"
            },
            {
                profile_pic: "/default-pfp.png",
                name: "John Doe"
            },
            {
                profile_pic: "/default-pfp.png",
                name: "John Doe"
            },
            {
                profile_pic: "/default-pfp.png",
                name: "John Doe"
            }
        ];

        const names = authors.map((data) => {
            if (data.name.length >= 14) {
                return data.name.slice(0, 14)+"...";
            } else {
                return data.name.slice(0, 14);
            }
        });
        const names_cut = names.slice(0, 3);
        
        return (
            <div className='header'>
                <div className='top row column_gap_4'>
                    <Profile_pics data={authors}/>
                    <p className='title'>{names_cut.join(", ")} {names.length > names_cut.length && `+ ${names.length-names_cut.length} others`} {names_cut.length >= 2 ? 'are' : 'is'} working on this</p>
                </div>
                {/* <b style={{ color: "red"}}>[need help]</b> */}
                <p className='Rows_backdrop_row1_left_content_header'>{data.title}</p>
            </div>
        )
    });

    if (issues == null) {
        return (
            <Home1 header="Issues">
                <Loading/>
            </Home1>
        )
    }

    const issues_ul = issues.map((data) => {
        return (
            <Rows_backdrop_row1 href={`${get_prepend(router)}/issue/${data.id}`} header={<Header data={data}/>} subchildren={<Sub_children data={data}/>} className="error_backdrop_row"/>
        )
    })
    
    return (
        <Home1 header="Test">
            <div className='content_ul'>
                <div className='row space_between'>
                    <div className='row'>
                        <select>
                            <option>Tests</option>
                            <option>Runners</option>
                        </select>
                        {/* <input placeholder="Search"/> */}
                    </div>
                    <Button_with_icon icon="/icons/plus.svg">Create</Button_with_icon>
                </div>

                {issues_ul}
                {/* <p className='no_more_errors greyText'>No more errors! - you're safe... for now</p> */}
            </div>
        </Home1>
    )
}