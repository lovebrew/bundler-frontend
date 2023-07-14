
import { styled } from '@mui/material/styles';
import {Stack} from "@mui/material";

export const FooterStack = styled(Stack)(({theme}) => ({
    backgroundColor: '#212121',
    justifyContent: 'center',
    flexGrow: 1,
    alignItems: 'center',
    verticalAlign:"middle"
}))

export const StyledItem = styled('div')(({theme}) => ({
    ...theme.typography.button,
    display:'flex',
    backgroundColor:'transparent',
    verticalAlign:'center',
    alignItems:'center',
    padding: theme.spacing(1)
}))