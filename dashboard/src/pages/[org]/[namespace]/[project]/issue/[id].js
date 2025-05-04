import './css/issue.css';
import '@/../styles/global.css';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Profile_pics from '@/components/user/profile_pics';
// import Error_Discussion, { get_discussion } from './tabs/discussion';
import Discussion, { get_discussion } from '../event/tabs/discussion';
import Loading from '@/components/navigating/in-progress/loading';
import LoadingSpinner from '@/components/miscellaneous/loadingspinner';
import Dialog_Frame from '@/components/dialogs/dialog_frame';
import Input_with_header from '@/components/input/input_with_header';
import Dropdown from '@/components/miscellaneous/dropdown';
import Rounded_editing_button from '@/components/internal_components/edit/rounded_editing_button';
import Button_with_icon from '@/components/button/image/button_with_icon';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Coastguard } from 'coast-guard';
import { credentials_object } from '@/pages/global';

export default function Issue() {
    const [tab, set_tab] = useState("discussion");
    const [events, set_events] = useState(null);
    const [discussion, set_discussion] = useState(null);
    const [event_user_rating, set_event_user_rating] = useState(null);
    const [discussion_user_rating, set_discussion_user_rating] = useState(null);
    const [event_discussion, set_event_discussion] = useState(null);
    const [jump_to, set_jump_to] = useState(null);

    const router = useRouter();
    const should_run = useRef(true);

    useEffect(() => {
        if (should_run.current != true || !router.query.id) { return; }
        should_run.current = false;

        run();
    });

    async function get_event_user_ratings(ids, handler) {
        let event_user_rating_v = await Coastguard(await credentials_object(router)).user_rating.list(ids);
        ids.forEach(event_id => {
            const thumbs_up = "👍";
            const thumbs_down = "👎";

            let modified_array = event_user_rating_v;
            const thumbs_down_rating = event_user_rating_v.data.find(r => r.id === event_id && r.emoji == thumbs_down);
            if (!thumbs_down_rating || thumbs_down_rating.emoji !== thumbs_down) {
                modified_array.data.unshift({ id: event_id, emoji: thumbs_down, count: 0 });
            } else {
                modified_array.data.splice(modified_array.data.indexOf(thumbs_down_rating), 1);
                modified_array.data.unshift(thumbs_down_rating);
            }

            const thumbs_up_rating = event_user_rating_v.data.find(r => r.id === event_id && r.emoji == thumbs_up);
            if (!thumbs_up_rating || thumbs_up_rating.emoji !== thumbs_up) {
                modified_array.data.unshift({ id: event_id, emoji: thumbs_up, count: 0 });
            } else {
                modified_array.data.splice(modified_array.data.indexOf(thumbs_up_rating), 1);
                modified_array.data.unshift(thumbs_up_rating);
            }

            event_user_rating_v = modified_array;
        });

        if (handler) {
            handler(event_user_rating_v);
        }

        return event_user_rating_v;
    }

    async function get_event_discussions(event_data) {
        const event_ids = event_data.map(event => "event-"+event.id);
        const event_discussions_v = await Coastguard(await credentials_object(router)).discussion.list(null, { nonce: event_ids });
        set_event_discussion(event_discussions_v.data);
    }

    async function init_get_discussion(event_data) {
        const [discussion_v] = await Promise.all([
            await get_discussion({ discussion_id: `events-${event_data[0].nonce_hash}` }, router)
        ]);

        if (!discussion_v || discussion_v.data[0] && discussion_v.data[0].not_found == true) {
            alert("404 - discussion");
        }

        set_discussion(discussion_v);
        set_discussion_user_rating(await get_event_user_ratings(discussion_v.data.map(event => "discussion-"+event.message_id)));
    }

    async function run() {
        // new thread
        const data = await Coastguard(await credentials_object(router)).issue.list([], { nonce_hash: [router.query.id] });
        if (data.data[0] && data.data[0].not_found == true) {
            alert("404");
            return;
        }

        const event_data = data.data;
        if (!event_data[0]) {
            alert("404");
            return;
        }

        set_event_user_rating(await get_event_user_ratings(event_data.map(event => "event-"+event.id)));
        get_event_discussions(event_data);
        init_get_discussion(event_data);

        set_events(data);
    }

    if (!events) {
        return <Home1>
            <Loading/>
        </Home1>;
    }

    const Discussion_authors = ((props) => {
        const discussion = props.discussion;
        if (!discussion) {
            return (
                <LoadingSpinner style={{ width: 10, height: 10 }}/>
            )
        }
        return (
            <Profile_pics data={discussion.authors}/>
        )
    });

    const Edit_dialog = ((props) => {
        return (
            <Dialog_Frame header="Update" id="edit_dialog">
                <Input_with_header header="Title" placeholder="Title"/>
                <Input_with_header header="Status">
                    <select>
                        <option>Open</option>
                        <option>Closed</option>
                        <option>Open</option>
                    </select>
                </Input_with_header>
                <button>Update</button>
            </Dialog_Frame>
        )
    });

    const discussion_status = discussion && discussion.data && discussion.data[0] ? true : false;

    if (events == null) {
        return (
            <Home1 header={["issue", router.query.id]} className="issue">
                <Loading/>
            </Home1>
        )
    }
    return (
        <Home1 header={["issue", router.query.id]} className="issue" style={{ padding: 12, paddingTop: 8 }}>
            <Edit_dialog/>
            {/* padding (outer) for this page should be expanded, from 6px to 8px on home1_children_content. */}
            <div className='topbar'>
                <h1 className='title'>{events.data[0].title.slice(0, 400)}</h1>

                <div className='row column_gap_10'>
                    <Input_with_header header={`Participants (${discussion && discussion.authors.length})`}>
                        <div className="row column_gap_4">
                            <Discussion_authors discussion={discussion}/>
                            <Rounded_editing_button/>
                        </div>
                    </Input_with_header>

                    <Input_with_header header={`Assigned (${discussion && discussion.authors.length})`}>
                        <div className="row column_gap_4">
                            <Discussion_authors discussion={discussion}/>
                            <Rounded_editing_button/>
                        </div>
                    </Input_with_header>
                </div>

                <div className='row space_between'>
                    <div className='row column_gap_6'>
                        <Button_with_icon icon="/icons/chat.svg" className={`tab_button ${tab == "discussion" && 'tab_button_selected'}`} onClick={() => { set_tab("discussion"); }}>Discussion <span className={`${discussion_status == true && discussion.total[discussion.data[0].discussion] > 0 && 'bold'} greyText`}>{discussion_status == true && `${discussion.total[discussion.data[0].discussion]}`}</span></Button_with_icon>
                    </div>

                    <div className='row column_gap_6'>
                        <Button_with_icon icon="/icons/bell-outline.svg">Subscribe</Button_with_icon>
                        <Dropdown icon={<Button_with_icon icon="/icons/ellipsis-solid.svg"/>}>
                            <Button_with_icon icon="/icons/assign.svg" onClick={() => { document.getElementById("edit_dialog").showModal(); }}>Assign</Button_with_icon>
                            {/* <Button_with_icon icon="/icons/lock.svg" onClick={() => { document.getElementById("edit_dialog").showModal(); }}>Lock</Button_with_icon> */}
                            <Button_with_icon icon="/icons/subtle-pencil-outline.svg" onClick={() => { document.getElementById("edit_dialog").showModal(); }}>Edit</Button_with_icon>
                            <Button_with_icon icon="/icons/trash.svg" onClick={() => { document.getElementById("edit_dialog").showModal(); }}>Delete</Button_with_icon>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className='content'>
                <div className='side_line'/>
                {tab == "discussion" && <Discussion discussion_id={`events-${events.data[0].nonce_hash}`} discussion={discussion} user_rating={discussion_user_rating} on_user_rating_update={() => { get_event_user_ratings(discussion.data.map(event => "discussion-"+event.message_id), set_discussion_user_rating) }} jump_to={jump_to} set_jump_to={set_jump_to} tab={tab} set_tab={set_tab}/>}
            </div>
        </Home1>
    )
}