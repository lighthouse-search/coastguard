import "./css/sidebar2.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Coastguard } from "coast-guard";
import { credentials_object } from "@/pages/global";
import Sidebar2_projects from "./tab/projects";
import Sidebar2_project from "./tab/project";
import ProfilePic from "@/components/user/profile_pic";
import UserCard1 from "@/components/user/user_cards/user_card1";
import Dropdown from "@/components/miscellaneous/dropdown";
import LoadingSpinner from "@/components/miscellaneous/loadingspinner";

export default function Sidebar2(props) {
    const expanded = false;
    const router = useRouter();
    const [account, set_account] = useState(null);

    async function get_account() {
        const data = await Coastguard(await credentials_object(router, { cache: "reload" })).account.me();
        set_account(data.data);
    }

    const should_run = useRef(true);
    useEffect(() => {
        if (should_run.current != true) { return; }
        should_run.current = false;
        
        get_account();
    });

    let Substitute = null;
    if (router.query.project) {
        Substitute = <Sidebar2_project/>
    } else {
        Substitute = <Sidebar2_projects/>
    }

    const Sidebar_base = ((props) => {
        return (
            <div className={`sidebar2 ${expanded == true ? "sidebar2_expanded" : ""} space_between`}>
                {Substitute}
    
                <div className="column">
                    <Dropdown icon={<ProfilePic href="/settings" src={account ? account.profile_pic : null}/>}>
                        {account && <UserCard1 user={{ ...account, email: account.username }}>
                            <button>Logout</button>
                        </UserCard1>}
                        {!account && <LoadingSpinner style={{ width: 10, height: 10 }}/>}
                    </Dropdown>
                </div>
            </div>
        )
    });

    return Sidebar_base(props);
}