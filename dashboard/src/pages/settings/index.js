import './css/settings.css';
import '../../../styles/global.css';
import Home1 from "@/components/home/home";
import Backdrop_content from "@/components/rows/backdrop/backdrop_content";
import Rows_backdrop_row1 from "@/components/rows/backdrop/rows/rows-backdrop-row1";
import { useEffect, useRef, useState } from 'react';
import { Coastguard } from 'coast-guard';
import { credentials_object } from '../global';
import UserCard1 from '@/components/user/user_cards/user_card1';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Input_with_header from '@/components/input/input_with_header';

export default function Settings() {
    const [name, set_name] = useState(null);
    const [username, set_username] = useState(null);
    const [email, set_email] = useState(null);

    const [show_full_version, set_show_full_version] = useState(false);

    const router = useRouter();
    const [account, set_account] = useState(null);

    async function get_account() {
        const data = await Coastguard(await credentials_object(router)).account.me();
        const account_v = data.data;
        set_account(account_v);

        set_name(account_v.name);
        set_username(account_v.username);
        set_email(account_v.email);
    }

    const should_run = useRef(true);
    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;
        
        get_account();
    });

    return (
        <Home1 header="Settings" className="home_padding settings_centered scrollY">
            <div className='settingsV'>
                <Backdrop_content header="My account" className="column row_gap_8">
                    <div className='column row_gap_4'>
                        <div className='row space_between'>
                            {account && <UserCard1 user={account}/>}
                            {/* <Link href="#">Logout</Link> */}
                        </div>
                        <Input_with_header header="Name" placeholder="John Doe" value={name} onChange={(e) => { set_name(e.target.value); }}/>
                        <Input_with_header header="Username" placeholder="john.doe" value={username} onChange={(e) => { set_username(e.target.value); }}/>
                        <Input_with_header header="Email" placeholder="john.doe@example.com" value={email} onChange={(e) => { set_email(e.target.value); }}/>
                        <button>Update</button>
                    </div>
                    
                    <div className='side_line'/>

                    <div className='column row_gap_4'>
                        <Rows_backdrop_row1 icon="/icons/security_hazard.svg" header="Two-factor authentication" href="/settings/me/two-factor"/>
                        <Rows_backdrop_row1 icon="/icons/key.svg" header="My Logins" href="/settings/me/my-logins"/>
                    </div>
                </Backdrop_content>

                <Backdrop_content header="Coast-guard settings" className="settings_backdrop_content">
                    <Rows_backdrop_row1 icon="/icons/palette.svg" header="Customization" href="/settings/customization"/>
                    <Rows_backdrop_row1 icon="/icons/meshing.svg" header="Meshing" href="/settings/meshing"/>
                    <Rows_backdrop_row1 icon="/icons/post_box.svg" header="SMTP connection (notifications)" href="/settings/smtp"/>
                    <Rows_backdrop_row1 icon="/icons/database.svg" header="SQL connection" href="/settings/sql"/>
                    <Rows_backdrop_row1 icon="/icons/backup.svg" header="Backup & restore" href="/settings/backup-or-restore"/>
                    <Rows_backdrop_row1 icon="/icons/spray-can-sparkles-solid.svg" header="Redaction rules" href="/settings/redaction-rules"/>
                    <p className="rover_version greyText">Coast-guard versions: {show_full_version != true && <a className='underline' onClick={() => { set_show_full_version(true) }}>Show</a>}
                        {show_full_version == true && <div>
                            Coast-guard admin panel: (Canary) 0.0.1
                            <br/>
                            Coast-guard server: (Canary) 0.0.1
                        </div>}
                    </p>
                </Backdrop_content>
            </div>
        </Home1>
    )
}