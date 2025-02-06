import Event_list from "../event";

export default function Request_list() {
    return (
        <Event_list header="Request" filter={{ type: ["request"], distinct: true }}/>
    )
}