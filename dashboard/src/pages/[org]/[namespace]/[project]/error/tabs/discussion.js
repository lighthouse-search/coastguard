import Button_with_icon from '@/components/button/image/button_with_icon';
import './css/discussion.css';
import '@/../styles/global.css';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Lettre from '@/components/internal_components/letter/lettre';
import Lettre_header from '@/components/internal_components/letter/lettre_header';
import Link from 'next/link';
import Reply_component from '@/components/internal_components/discussion/reply_component';
import File_list from '@/components/internal_components/file/file_list';
import { useEffect, useRef, useState } from 'react';
import { Coastguard } from 'coast-guard';
import { credentials_object } from '@/pages/global';
import { useRouter } from 'next/router';
import Loading from '@/components/navigating/in-progress/loading';

export async function get_discussion(props, router, set_handler) {
    const data = await Coastguard(await credentials_object(router)).discussion.list(props.discussion_id);
    if (!data || data.data[0] && data.data[0].not_found == true) {
        alert("404");
        throw "404";
    }
    if (set_handler) {
        set_handler(data);
    }
    return data;
}

export default function Discussion(props) {
    const router = useRouter();
    const should_run = useRef(true);

    const [discussion, set_discussion] = useState(null);

    useEffect(() => {
        if (should_run.current != true || !router.query.id) { return; }
        should_run.current = false;

        if (props.discussion) {
            set_discussion(props.discussion);
            return;
        }

        get_discussion(props, router, set_discussion);
    });

    const header = `Failed to send email: "Could not send email: lettre::transport::smtp::Error { kind: Connection, source: Failure(Ssl(Error { code: ErrorCode(1), cause: Some(Ssl(ErrorStack([Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 167772294, library: \"SSL routines\", function: \"tls_post_process_server_certificate\", reason: \"certificate verify failed\", file: \"../ssl/statem/statem_clnt.c\", line: 1889 }]))) }, X509VerifyResult { code: 19, error: \"self-signed certificate in certificate chain\" })) }"`;

    const like = `👍`;
    const dislike = `👎`;

    const Lettre_frame = ((props) => {
        const data = props.data;
        // const Roles = ["Senior", "Software"].map((data) => {
        //     return (
        //         <p className='user_role outline'>{data}</p>
        //     )
        // });
        // <div className='row'>
        //     {Roles}
        // </div>

        // TODO: Make this a discussion component
        return (
            <Lettre {...props}>
                <div className='discussion_post column row_gap_4'>
                    {/* <p className='greyText sub_text'>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, {new Date().toDateString([], { day: "numeric", month: "long", year: "numeric" })}</p> */}
                    <p className='greyText sub_text'>2 hours ago</p>
                    <div className='row space_between'>
                        <div className='row column_gap_6'>
                            <img style={{ width: 34, height: 34, borderRadius: 2 }} src={data.author.profile_pic}/>
                            <div className='row column_gap_10'>
                                <div className='column'>
                                    <b className='greyText'>{data.author.name}</b>
                                    <p className='greyText sub_text'>{data.author.username} • {data.author.pronouns.join("/")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Placeholder (action buttons [e.g. share]) */}
                    </div>
                    <div className='user_post_content column row_gap_4'>
                        <p>{data.content}</p>
                        <File_list data={[
                            { name: "signal-desktop-mac-universal-6.47.0.dmg", size: 241415511, href: "#" },
                            { name: "screenshot.pngscreenshot.pngscreenshot.pngscreenshot.png", size: 241415511, href: "#" }
                        ]}/>
                    </div>
                </div>
            </Lettre>
        )
    });

    if (discussion == null) {
        return <Loading/>;
    }

    const discussion_ul = discussion.data.map((data) => {
        return (
            <Lettre_frame id={data.id} data={data}/>
        )
    });

    return (
        <div className='row align_items_start column_gap_6'>
            <div className='lettre_ul width_100'>
                {discussion_ul}

                <Reply_component discussion_id={props.discussion_id} on_update={() => { get_discussion({ discussion_id: props.discussion_id }, router, set_discussion); }}/>
            </div>
            <button onClick={() => { document.getElementById("reply_component").scrollIntoView({ behavior: "smooth" }); }}>Down</button>
        </div>
    )
}