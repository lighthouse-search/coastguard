import Button_with_icon from '@/components/button/image/button_with_icon';
import './css/error.css';
import '@/../styles/global.css';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Profile_pics from '@/components/user/profile_pics';
import Lettre from '@/components/internal_components/letter/lettre';
import Lettre_header from '@/components/internal_components/letter/lettre_header';

export default function Bug() {
    const header = `Failed to send email: "Could not send email: lettre::transport::smtp::Error { kind: Connection, source: Failure(Ssl(Error { code: ErrorCode(1), cause: Some(Ssl(ErrorStack([Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 167772294, library: \"SSL routines\", function: \"tls_post_process_server_certificate\", reason: \"certificate verify failed\", file: \"../ssl/statem/statem_clnt.c\", line: 1889 }]))) }, X509VerifyResult { code: 19, error: \"self-signed certificate in certificate chain\" })) }"`;

    const authors1 = [
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
    
    return (
        <Home1 header="Bugs" className="error" style={{ padding: 12 }}>
            {/* padding (outer) for this page should be expanded, from 6px to 8px on home1_children_content. */}
            <div className='topbar'>
                <h1 className='title'>{header}</h1>
                <div className='row column_gap_6'>
                    <Profile_pics data={authors1}/>
                    <p>• {authors1.length} people</p>
                </div>

                <div className='row column_gap_6'>
                    {/* button_with_icon should be used here. */}
                    <Button_with_icon icon="/icons/explosion-solid.svg" className="tab_button tab_button_selected">Events <span className='no_bold greyText'>240,871</span></Button_with_icon>
                    <Button_with_icon icon="/icons/chat.svg" className="tab_button">Discussion <span className='no_bold greyText'>117</span></Button_with_icon>
                    {/* <Button_with_icon icon="/icons/code-solid.svg" className="tab_button">Code</Button_with_icon> */}
                </div>
            </div>

            <div className='content'>
                <div className='side_line'/>

                <h4>Events</h4>
                <div className='lettre_ul'>
                    <Lettre>
                        <Lettre_header header="Requestee">
                            {/* list software (browsers, etc) that this happens on. */}
                            <ul>
                                <li>User ID: did:plc:wtdzzfgzjpirnk5wvpjutqoy</li>
                                <li>Contact: hi@oracularhades.com</li>
                                <li>Client: Firefox (Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0)</li>
                            </ul>
                        </Lettre_header>
                        <Lettre_header header="Backend">
                            {/* list software (browsers, etc) that this happens on. */}
                            <ul>
                                <li>API <ul><li>lettre</li></ul></li>
                            </ul>
                        </Lettre_header>
                        <Lettre_header header="Error">
                            <code>{header}</code>
                        </Lettre_header>
                    </Lettre>
                </div>
            </div>
        </Home1>
    )
}