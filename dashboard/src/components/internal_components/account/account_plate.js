export default function Account_nameplate(props) {
    const author = props.data;
    return (
        <div className='row column_gap_6'>
            <img style={{ width: 34, height: 34, borderRadius: 2 }} src={author.profile_pic}/>
            <div className='row column_gap_10'>
                <div className='column'>
                    <b className='greyText'>{author.name}</b>
                    {props.sub_text != false && <p className='greyText sub_text'>{author.username} • {author.pronouns.join("/")}</p>}
                </div>
            </div>
        </div>
    )
}