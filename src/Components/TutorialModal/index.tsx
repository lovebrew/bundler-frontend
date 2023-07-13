import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function TutorialModal() {
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        const firstTime = localStorage.getItem("bundler.firstTime");
        if (firstTime === "true") {
            return false;
        }
        return open
    }

    const handleClose = () => {
        setOpen(false)
        localStorage.setItem("bundler.firstTime", "true");
    };

    return (
        <div>
            <Dialog
                open={handleOpen()}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ 'border-radius': 4 }}
            >
                <DialogTitle id="alert-dialog-title">
                    {"How to use LÖVEBrew"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <h3>Configuration Files</h3>
                        Click the button on the bottom right to create
                        a custom configuration file.

                        <h3>Bundling a Game</h3>
                        If you would like to bundle your game, then do one of the following:
                        <ul>
                            <li>Click the web page and browse for or a zip file</li>
                            <li>Click and drag a zip file into this window.</li>
                        </ul>
                        This zip file must contain the configuration file and zipped game data
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>I understand</Button>
                </DialogActions>
            </Dialog >
        </div >
    );
}
