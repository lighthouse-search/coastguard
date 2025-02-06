import Event_list from "../event";

export default function Error_list() {
    return (
        <Event_list header="Error" filter={{ type: ["error"], distinct: true }}/>
    )
}