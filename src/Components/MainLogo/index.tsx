import Logo from "../../assets/logo.svg"

import {Potion} from "./styles";

function MainLogo() {
    return(
        <Potion src={Logo} onClick={()=>alert("File browser will open")} />
    )
}

export default MainLogo;