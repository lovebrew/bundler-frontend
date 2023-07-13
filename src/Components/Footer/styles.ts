
import { styled } from '@mui/material/styles';
import {Stack} from "@mui/material";

export const FooterStack = styled(Stack)(({theme}) => ({
    backgroundColor: '#212121',
    justifyContent: 'center',
    alignItems: 'center',
    verticalAlign: "middle",
    textAlign: "center",
    width: "100vw",
    "min-height": "16px",
    "padding-top": "8px",
    "padding-bottom": "8px",
    left: 0,
    bottom: 0
}))

export const StyledItem = styled('div')(({theme}) => ({
    ...theme.typography.button,
    display: 'flex',
    backgroundColor: 'transparent',
    verticalAlign: 'center',
    alignItems: 'center',
    padding: theme.spacing(1),
    margin: 0
}))