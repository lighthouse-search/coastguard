import './css/reply_component.css';
import Button_with_icon from "@/components/button/image/button_with_icon";
import Lettre from "../letter/lettre";
import { useState } from 'react';
import { Coastguard } from 'coast-guard';
import { credentials_object } from '@/pages/global';
import { useRouter } from 'next/router';

export default function Reply_component(props) {
    const router = useRouter();
    const [content, set_content] = useState(null);
    async function post() {
        const data = await Coastguard(await credentials_object(router)).discussion.update([{ action: "create", id: props.discussion_id, content: content, nonce: props.nonce }]);
        if (props.on_update) {
            props.on_update(data);
        }
        set_content("");
        document.getElementById('reply_component').scrollIntoView({ });
    }

    return (
        <Lettre className="reply_component" id="reply_component">
            <h4>Reply</h4>
            <div className='user row space_between column_gap_6'>
                <img style={{ width: 40, height: 40 }} src="https://cdn.bsky.app/img/avatar/plain/did:plc:ec72yg6n2sydzjvtovvdlxrk/bafkreib6vy272khka47dedwort35c4zxl52j4ddijh2e7m23laaebotytq@jpeg"/>
                <textarea placeholder="Type here..." value={content} onChange={(e) => { set_content(e.target.value); }}/>
            </div>
            <div className='row space_between'>
                <span/>
                <div className='row column_gap_4'>
                    <Button_with_icon icon="/icons/upload.svg"/>
                    <button onClick={() => { post(); }}>Post</button>
                </div>
            </div>
        </Lettre>
    )
};