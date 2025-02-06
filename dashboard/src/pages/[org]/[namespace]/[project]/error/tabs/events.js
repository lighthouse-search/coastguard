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

export async function get_event(props, router, set_handler) {
    const data = await Coastguard(await credentials_object(router)).event.list(props.error);
    if (!data || data.data[0] && data.data[0].not_found == true) {
        alert("404");
        throw "404";
    }
    if (set_handler) {
        set_handler(data);
    }
    return data;
}

export default function Error_Events(props) {
    const router = useRouter();
    const should_run = useRef(true);

    const [event, set_event] = useState(null);

    useEffect(() => {
        if (should_run.current != true || !router.query.id) { return; }
        should_run.current = false;

        if (props.event) {
            set_event(props.event);
            return;
        }

        get_event(props, router, set_event);
    });

    const header = `Failed to send email: "Could not send email: lettre::transport::smtp::Error { kind: Connection, source: Failure(Ssl(Error { code: ErrorCode(1), cause: Some(Ssl(ErrorStack([Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 167772294, library: \"SSL routines\", function: \"tls_post_process_server_certificate\", reason: \"certificate verify failed\", file: \"../ssl/statem/statem_clnt.c\", line: 1889 }]))) }, X509VerifyResult { code: 19, error: \"self-signed certificate in certificate chain\" })) }"`;

    const like = `👍`;
    const dislike = `👎`;

    const Lettre_frame = ((props) => {
        return (
            <Lettre>
                <Lettre_header header="Tags">
                    {/* list software (browsers, etc) that this happens on. */}
                    <ul>
                        <li>User
                            <ul>
                                <li>user/user-id: did:plc:wtdzzfgzjpirnk5wvpjutqoy</li>
                                <li>user/contact: hi@example.com</li>
                                <li>user/client: Firefox (Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0)</li>
                            </ul>
                        </li>
                        <li>Libraries
                            <ul>
                                <li>lettre</li>
                            </ul>
                        </li>
                    </ul>
                </Lettre_header>

                <Lettre_header header="Content">
                    <code>{data.content}</code>
                </Lettre_header>

                <div className='row column_gap_10'>
                    <div className='row column_gap_4'>
                        <Button_with_icon icon="/icons/add-reaction-outline.svg"/>
                        <button>
                            {like} 240
                        </button>
                        <button>
                            {dislike} 240
                        </button>
                    </div>

                    <Button_with_icon icon="/icons/reply_square_add_outline.svg">Reply</Button_with_icon>
                </div>

                <div className='row column_gap_6'>
                    <img style={{ width: 40, height: 40 }} src="https://cdn.bsky.app/img/avatar/plain/did:plc:ec72yg6n2sydzjvtovvdlxrk/bafkreib6vy272khka47dedwort35c4zxl52j4ddijh2e7m23laaebotytq@jpeg"/>
                    <div className=''>
                        <b className='greyText'>John Doe</b>
                        <p>I was. And I was given remedial lessons because it was illegible to anyone but me.

    And now when I make notes it’s all illegible to everyone, including me.</p>
                    </div>
                </div>

                <Link className='greyText underline' href="./discussion">View discussion</Link>
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