import Link from 'next/link';
import './css/file_list.css';

export default function File_list(props) {
    function format_bytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const formatted = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
        return `${formatted} ${sizes[i]}`;
    }

    const files_ul = props.data.map((file, key) => {
        return (
            <div className='file'>
                <p className='size greyText'>{format_bytes(file.size)}</p>
                <Link href={file.href} className='hover_underline name'>{file.name}</Link>
            </div>
        )
    });
    
    return (
        <div className='file_list outline'>
            {/* <h4>Files</h4> */}
            {files_ul}
        </div>
    )
}