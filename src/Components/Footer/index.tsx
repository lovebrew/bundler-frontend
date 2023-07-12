import {Icon, Button, Box} from "@mui/material";
import { styled } from '@mui/material/styles';
import {Copyright, FiberManualRecord, GitHub, MonetizationOn, Money, Science} from "@mui/icons-material";
import {FooterStack, StyledItem} from "./styles";

type ItemProps = {
    name: string;
    url?: string;
    icon: Icon;
}

function Item(props:ItemProps) {
    if(props.url == undefined){
        return <StyledItem>{props.icon}{props.name}</StyledItem>
    }
    return <Button variant="plain" component="a" href={props.url} startIcon={props.icon}>{props.name}</Button>
}


function Footer() {
    return (
            <FooterStack direction="row" flexWrap="wrap">
                <Item name={"LÖVE Potion"} url={"https://github.com/lovebrew/lovepotion"} icon={<Science/>} />
                <i>•</i>
                <Item name={"Source Code"} url={"https://github.com/lovebrew/lovebrew-webserver"} icon={<GitHub/>}  />
                <i>•</i>
                <Item name={"Donate"} url={"https://paypal.me/TurtleP?country.x=US&locale.x=en_US"} icon={<MonetizationOn/>} />
                <i>•</i>
                <Item name={"LÖVEBrew Team"} icon={<Copyright/>}/>
            </FooterStack>
    )
}

export default Footer;