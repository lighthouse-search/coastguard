import './css/errors.css';
import '@/../styles/global.css';
import "@/components/global.css";
import Home1 from "@/components/home/home";
import Rows_backdrop_row1 from "@/components/rows/backdrop/rows/rows-backdrop-row1";
import Profile_pics from '@/components/user/profile_pics';
import Button_with_icon from '@/components/button/image/button_with_icon';

export default function Bug_Index() {
    const header = `Failed to send email: "Could not send email: lettre::transport::smtp::Error { kind: Connection, source: Failure(Ssl(Error { code: ErrorCode(1), cause: Some(Ssl(ErrorStack([Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 369098857, library: \"STORE routines\", function: \"ossl_store_get0_loader_int\", reason: \"unregistered scheme\", file: \"../crypto/store/store_register.c\", line: 237, data: \"scheme=file\" }, Error { code: 2147483650, library: \"system library\", function: \"file_open\", file: \"../providers/implementations/storemgmt/file_store.c\", line: 267, data: \"calling stat(/usr/lib/ssl/certs)\" }, Error { code: 167772294, library: \"SSL routines\", function: \"tls_post_process_server_certificate\", reason: \"certificate verify failed\", file: \"../ssl/statem/statem_clnt.c\", line: 1889 }]))) }, X509VerifyResult { code: 19, error: \"self-signed certificate in certificate chain\" })) }"`;
    const Sub_children = ((props) => {
        return (
            <div className='sub_children greyText'>
                {/* TODO: / NOTE TO SELF: The way we'll know which services are involved in an error is allowing admins to check if a specific API (such as an SQL library) was called in the error logs. */}
                <a href="https://example.com" className='greyText'>API (staging), MariaDB (prod)</a>
                <p>•</p>
                <a href="https://example.com" className='greyText'>240,141 events</a>
                <p>•</p>
                <a href="https://example.com" className='greyText'>27-02-2024 (2h)</a>
            </div>
        )
    });

    const Header = (() => {
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
                <div className='top'>
                    <Profile_pics data={authors}/>
                    <p className='title'>{names_cut.join(", ")} {names.length > names_cut.length && `+ ${names.length-names_cut.length} others`} {names_cut.length >= 2 ? 'are' : 'is'} working on this</p>
                </div>
                <p className='Rows_backdrop_row1_left_content_header'><b style={{ color: "red"}}>[need help]</b> {header}</p>
            </div>
        )
    })
    
    return (
        <Home1 header="Bugs">
            <div className='content_ul'>
                <div className='row space_between'>
                    <input placeholder="Search"/>
                    <Button_with_icon icon="/icons/plus.svg">Create</Button_with_icon>
                </div>
                <Rows_backdrop_row1 icon={<p className='event_count'>#12,495</p>} header={<Header/>} subchildren={<Sub_children/>} className="error_backdrop_row"/>
                <Rows_backdrop_row1 icon={<p className='event_count'>#12,494</p>} header={header} subchildren={<Sub_children/>} className="error_backdrop_row"/>
                <Rows_backdrop_row1 icon={<p className='event_count'>#12,493</p>} header={header} subchildren={<Sub_children/>} className="error_backdrop_row"/>
                <Rows_backdrop_row1 icon={<p className='event_count'>#12,492</p>} header={header} subchildren={<Sub_children/>} className="error_backdrop_row"/>
                <Rows_backdrop_row1 icon={<p className='event_count'>#12,491</p>} header={header} subchildren={<Sub_children/>} className="error_backdrop_row"/>
                {/* <p className='no_more_errors greyText'>No more errors! - you're safe... for now</p> */}
            </div>
        </Home1>
    )
}