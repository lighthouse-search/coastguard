import Button_with_icon from "../button/image/button_with_icon";
import Dropdown from "../miscellaneous/dropdown";
import LoadingSpinner from "../miscellaneous/loadingspinner";
import Ratings_button, { update_reaction } from "./user_rating/user_rating";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useRouter } from "next/router";
const emoji_data = data;

export default function Interaction_bottom_bar(page_props) {
    const router = useRouter();
    const data = page_props.data;

    const ratings_ul = (page_props.user_rating ? page_props.user_rating.data : []).filter(user_rating => user_rating.id === page_props.id).map((reaction) => {
        let user_involved = false;
        if (page_props.user_rating.my_user_rating.filter(my_user_rating => my_user_rating.id === reaction.id && my_user_rating.emoji == reaction.emoji).length > 0) {
            // User has already used this reaction.
            user_involved = true;
        }
        return (
            <Ratings_button data={reaction} user_involved={user_involved} on_update={page_props.on_user_rating_update}/>
        )
    });

    return (
        <div className='row column_gap_8'>
            <div className='row column_gap_6'>
                <Button_with_icon icon="/icons/reply_square_add_outline.svg" onClick={() => { page_props.set_reply_enabled(page_props.id); }}>Reply</Button_with_icon>
            </div>

            <div className='row column_gap_6 row_gap_6 flex_wrap'>
                <Dropdown icon={<Button_with_icon icon="/icons/add-reaction-outline.svg"/>}>
                    <Picker theme="light" data={emoji_data} onEmojiSelect={(e) => { update_reaction("create", page_props.id, e.native, router, page_props.on_user_rating_update); }}/>
                </Dropdown>

                {page_props.user_rating != null && ratings_ul}
                {page_props.user_rating == null && <LoadingSpinner style={{ width: 12, height: 12 }}/>}
            </div>
        </div>
    )
}