import { useState } from "react";
import "./css/user_rating.css";
import { Coastguard } from "coast-guard";
import { credentials_object } from "@/pages/global";
import { useRouter } from "next/router";

export async function update_reaction(action, id, emoji, router, on_user_rating_update) {
    await Coastguard(await credentials_object(router)).user_rating.update([{ action: action, id: id, emoji: emoji }]);
    if (on_user_rating_update) {
        on_user_rating_update();
    }
}

export default function Ratings_button(props) {
    const router = useRouter();

    const data = props.data;

    const [user_involved, set_user_involved] = useState(props.user_involved);
    const [count, set_count] = useState(data.count);

    async function trigger_reaction() {
        if (user_involved == true) {
            await update_reaction("remove", data.id, data.emoji, router, (() => { set_user_involved(false); set_count(count-1); if (props.on_update) { props.on_update(); } }));
            set_user_involved(false);
        } else {
            await update_reaction("create", data.id, data.emoji, router, (() => { set_user_involved(true); set_count(count+1); if (props.on_update) { props.on_update(); } }));
        }
    }

    return (
        <button onClick={() => { trigger_reaction(); }} {...props} className={`user_rating ${user_involved == true && 'user_rated'} ${props.className}`}>{data.emoji} {count}</button>
    )
}