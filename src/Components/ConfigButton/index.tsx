import Fab from "@mui/material/Fab";

import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Zoom from "@mui/material/Zoom"

import { isMobile } from "react-device-detect";

export default function ConfigEditor() {
    const transitionDuration = {
        enter: 500,
        exit: 500,
    };

    const variantType = isMobile ? "circular" : "extended";
    const text = isMobile ? "" : "New Configuration File"
    const mrSpacing = isMobile ? 0 : 1

    return (
        <Box sx={{ '& > :not(style)': { m: 1 }, "position": "relative", "bottom": "0", "left": "80%", "right": "0", "top": "40%" }}>
            <Zoom timeout={transitionDuration} in key={"primary"} unmountOnExit>
                <Fab variant={variantType} color="primary" aria-label="New Config">
                    <EditIcon sx={{ mr: { mrSpacing } }} />
                    {text}
                </Fab>
            </Zoom>
        </Box >
    );
}
