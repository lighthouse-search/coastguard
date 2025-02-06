import './css/customization.css';
import './css/settings.css';
import Home1 from "@/components/home/home";
import Input_with_header from '../../components/input/input_with_header';

export default function Settings_Customization() {
    return (
        <Home1 header="Customization" className="home_padding settings settings_centered">
            {/* <Selector1 header="Logo" src={null} type="clubs_logo" onImageId={(image_id) => {  }}/> */}
            <Input_with_header header="Alias" value={"test"}/>
            <Input_with_header header="Description" value={"test"}/>
            <button>Save changes</button>
        </Home1>
    )
}