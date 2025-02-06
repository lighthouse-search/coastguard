import Button_with_icon from '@/components/button/image/button_with_icon';
import './css/events.css';
import '@/../styles/global.css';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Lettre from '@/components/internal_components/letter/lettre';
import Lettre_header from '@/components/internal_components/letter/lettre_header';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Coastguard } from 'coast-guard';
import { credentials_object } from '@/pages/global';
import Loading from '@/components/navigating/in-progress/loading';
import Reply_component from '@/components/internal_components/discussion/reply_component';
import LoadingSpinner from '@/components/miscellaneous/loadingspinner';
import Account_nameplate from '@/components/internal_components/account/account_plate';
import Ratings_button, { update_reaction } from '@/components/internal_components/user_rating/user_rating';
import Interaction_bottom_bar from '@/components/internal_components/interaction_bottom_bar';

export async function get_event(props, router, set_handler) {
    const data = await Coastguard(await credentials_object(router)).event.list(props.error);
    if (!data || data.data[0] && data.data[0].not_found == true) {
        alert("404");
        throw "404";
    }
    if (set_handler) {
        set_handler(data);
    }

    // const event_ids = event_data.map(event => event.id);
    // const user_rating = await Coastguard(await credentials_object(router)).user_rating.list(event_ids);

    return {data};
}

export default function Error_Events(page_props) {
    const router = useRouter();
    const should_run = useRef(true);

    const [event, set_event] = useState(null);

    useEffect(() => {
        if (should_run.current != true || !router.query.id) { return; }
        should_run.current = false;

        if (page_props.event) {
            set_event(page_props.event);
            return;
        }

        get_event(page_props, router, set_event);
    });

    const header = `Failed to send email: "Could not send email: lettre::transport::smtp::Error { kind: Connection, source: Failure(Ssl(Error { code: ErrorCode(1), cause: Some(Ssl(ErrorStack([Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 167772294, library: \"SSL routines\", function: \"tls_post_process_server_certificate\", reason: \"certificate verify failed\", file: \"../ssl/statem/statem_clnt.c\", line: 1889 }]))) }, X509VerifyResult { code: 19, error: \"self-signed certificate in certificate chain\" })) }"`;

    const like = `👍`;
    const dislike = `👎`;

    function iter_object(data) {
        if (typeof data == "object") {
            return iter_object(data)
        } else {

        }
    }

    const Lettre_frame = ((props) => {
        const data = props.data;

        const [reply_enabled, set_reply_enabled] = useState(null);

        const ratings_ul = (page_props.user_rating ? page_props.user_rating.data : []).filter(user_rating => user_rating.id === "event-"+data.id).map((reaction) => {
            let user_involved = false;
            if (page_props.user_rating.my_user_rating.filter(my_user_rating => my_user_rating.id === reaction.id && my_user_rating.emoji == reaction.emoji).length > 0) {
                // User has already used this reaction.
                user_involved = true;
            }
            return (
                <Ratings_button data={reaction} user_involved={user_involved} on_update={page_props.on_user_rating_update}/>
            )
        });

        const discussions_ul = (page_props.discussion ? page_props.discussion : []).filter(discussion => discussion.nonce === "event-"+data.id).map((data) => {
            const max_characters = 500;
            return (
                <div className='column row_gap_4'>
                    <div className='row space_between'>
                        <Account_nameplate data={data.author} sub_text={false}/>
                        <div className='row'>
                            <button>Reply</button>
                        </div>
                    </div>
                    <p className='flex_wrap'>
                        {data.content.slice(0, max_characters)+(data.content.length > max_characters ? "..." : "")}
                        {data.content.length > max_characters && <Link href="#">Show more</Link>}
                    </p>
                </div>
            )
        });
        
        // Remember: This is going to be metadata and not tags. We're just borrowing the tags variable before moving to metadata.
        const tags_ul = Object.keys(data.metadata).map((key) => {
            const rows = Object.values(data.metadata[key]).map((value, index) => {
                if (typeof value == "object") {
                    return;
                }
                return (
                    <p className='tag secondary_element'>{key}/{Object.keys(data.metadata[key]).find(k => data.metadata[key][k] === value)}: {value}</p>
                )
            });

            return (
                <div>
                    {rows}
                </div>
            )
        });

        return (
            <Lettre className="event_component">
                <Lettre_header header="Tags">
                    {/* list software (browsers, etc) that this happens on. */}
                    {tags_ul}
                </Lettre_header>

                {/* {data.metadata && <Lettre_header header="Metadata">
                    <code>{JSON.stringify(data.metadata, null, 2)}</code>
                </Lettre_header>} */}
                <Lettre_header header="Content">
                    <code>{data.content}</code>
                </Lettre_header>

                <div className='row column_gap_10'>
                    <Interaction_bottom_bar id={"event-"+data.id} user_rating={page_props.user_rating} set_reply_enabled={set_reply_enabled} on_user_rating_update={page_props.on_user_rating_update}/>
                </div>

                {discussions_ul.length > 0 && <div className='event_discussion_preview column row_gap_8'>
                    {discussions_ul}
                </div>}

                {reply_enabled != null && <Reply_component discussion_id={`events-${data.nonce_hash}`} nonce={`event-${data.id}`} on_update={() => {  }}/>}
                    
                {discussions_ul.length > 0 && <Link className='greyText underline' href="./discussion">View discussion</Link>}
            </Lettre>
        )
    });

    if (event == null) {
        return <Loading/>;
    }

    const event_ul = event.data.map((data) => {
        return (
            <Lettre_frame data={data}/>
        )
    });

    if (event_ul.length == 0) {
        return (
            <div>
                <h4>No events</h4>
            </div>
        )
    }
    
    return (
        <div>
            {/* <h4>Events</h4> */}
            <div className='lettre_ul'>
                {event_ul}
            </div>
        </div>
    )
}