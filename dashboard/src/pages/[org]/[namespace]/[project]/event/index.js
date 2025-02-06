import './css/events.css';
import '@/../styles/global.css';
import Button_with_icon from '@/components/button/image/button_with_icon';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Loading from '@/components/navigating/in-progress/loading';
import Rows_backdrop_row1 from "@/components/rows/backdrop/rows/rows-backdrop-row1";
import { credentials_object } from '@/pages/global';
import { Coastguard } from 'coast-guard';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function Event_list(props) {
    const router = useRouter();
    const should_run = useRef(true);
    const [events, set_events] = useState(null);

    useEffect(() => {
        if (should_run.current != true || !router.query.org) { return; }
        should_run.current = false;

        run();
    });

    async function run() {
        const data = await Coastguard(await credentials_object(router)).event.list([], props.filter ? props.filter : { distinct: true });
        set_events(data.data);
    }

    const Sub_children = ((props) => {
        return (
            <div className='sub_children greyText'>
                {/* TODO: / NOTE TO SELF: The way we'll know which services are involved in an error is allowing admins to check if a specific API (such as an SQL library) was called in the error logs. */}
                <p className='greyText'>API (staging), MariaDB (prod)</p>
                <p>•</p>
                <p className='greyText'>240,141 events</p>
                <p>•</p>
                <p className='greyText'>27-02-2024 (2h)</p>
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
                <b>{data.alias ? data.alias : data.nonce.slice(0, 400)}</b> 
                <p className='Rows_backdrop_row1_left_content_header'>{data.type}</p>
            </div>
        )
    });

    if (events == null) {
        return (
            <Home1 header="Errors">
                <Loading/>
            </Home1>
        )
    }

    const events_ul = events.map((data) => {
        return (
            <Rows_backdrop_row1
                href={`/${router.query.org}/${router.query.namespace}/${router.query.project}/event/${data.nonce_hash}`}
                header={<Header data={data}/>}
                // subchildren={<Sub_children/>}
                className="event_backdrop_row"/>
        )
    });

    return (
        <Home1 header={props.header ? props.header : "Events"} className="row_gap_8">
            <div className='row space_between'>
                <div>
                    <input placeholder='Search'/>
                </div>
                <div>
                    <Button_with_icon>Filter</Button_with_icon>
                </div>
            </div>
            <div className='content_ul'>
                {events_ul}
                {/* icon={<p className='event_count'>#12,495</p>} */}
                {/* <p className='no_more_errors greyText'>No more errors! - you're safe... for now</p> */}
            </div>
        </Home1>
    )
}