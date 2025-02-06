import Button_with_icon from '@/components/button/image/button_with_icon';
import './css/error.css';
import '@/../styles/global.css';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Profile_pics from '@/components/user/profile_pics';
import Lettre from '@/components/internal_components/letter/lettre';
import Lettre_header from '@/components/internal_components/letter/lettre_header';
import Link from 'next/link';
import Error_Events, { get_event } from './tabs/events';
import Error_Discussion, { get_discussion } from './tabs/discussion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Coastguard } from 'coast-guard';
import { credentials_object } from '@/pages/global';
import Loading from '@/components/navigating/in-progress/loading';
import LoadingSpinner from '@/components/miscellaneous/loadingspinner';
import Dialog_Frame from '@/components/dialogs/dialog_frame';
import Input_with_header from '@/components/input/input_with_header';
import ToolTip from '@/components/miscellaneous/tooltip';
import Dropdown from '@/components/miscellaneous/dropdown';
import Rounded_editing_button from '@/components/internal_components/edit/rounded_editing_button';

export default function Error() {
    const [tab, set_tab] = useState("events");
    const [error, set_error] = useState(null);
    const [event, set_event] = useState(null);
    const [discussion, set_discussion] = useState(null);

    const router = useRouter();
    const should_run = useRef(true);

    useEffect(() => {
        if (should_run.current != true || !router.query.id) { return; }
        should_run.current = false;

        run();
    });

    async function run() {
        // new thread
        const data = await Coastguard(await credentials_object(router)).error.list([router.query.id]);
        if (data.data[0] && data.data[0].not_found == true) {
            alert("404");
            return;
        }
        set_error(data.data[0]);
        const error_v = data.data[0];

        const [event_v, discussion_v] = await Promise.all([
            await get_event({ event_id: error_v.event }, router),
            await get_discussion({ discussion_id: error_v.discussion }, router)
        ]);

        if (!event_v || event_v.data[0] && event_v.data[0].not_found == true) {
            alert("404 - event");
        } else {
            set_event(event_v);
        }

        if (!discussion_v || discussion_v.data[0] && discussion_v.data[0].not_found == true) {
            alert("404 - discussion");
        } else {
            set_discussion(discussion_v);
        }
    }

    if (!error) {
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

    const discussion_status = discussion && discussion.discussion && discussion.discussion.length > 0 ? true : false;

    return (
        <Home1 header="Errors" className="error" style={{ padding: 12, paddingTop: 8 }}>
            <Edit_dialog/>
            {/* padding (outer) for this page should be expanded, from 6px to 8px on home1_children_content. */}
            <div className='topbar'>
                <h1 className='title'>{error.title}</h1>

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
                        {/* button_with_icon should be used here. */}
                        <Button_with_icon icon="/icons/explosion-solid.svg" className={`tab_button ${tab == "events" && 'tab_button_selected'}`} onClick={() => { set_tab("events"); }}>Events <span className='no_bold greyText'>{event && `${event.total}`}</span></Button_with_icon>
                        <Button_with_icon icon="/icons/chat.svg" className={`tab_button ${tab == "discussion" && 'tab_button_selected'}`} onClick={() => { set_tab("discussion"); }}>Discussion <span className={`${discussion_status == true && discussion.total[discussion.data[0].id] > 0 && 'bold'} greyText`}>{discussion_status == true && `${discussion.total[discussion.data[0].id]}`}</span></Button_with_icon>
                        {/* <Button_with_icon icon="/icons/code-solid.svg" className="tab_button">Code</Button_with_icon> */}
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
                {tab == "events" && <Error_Events event={event}/>}
                {tab == "discussion" && <Error_Discussion discussion_id={error.discussion} discussion={discussion}/>}
            </div>
        </Home1>
    )
}