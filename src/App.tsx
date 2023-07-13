import './App.css';
import MainLogo from "./Components/MainLogo";
import Footer from "./Components/Footer";
import TutorialModal from "./Components/TutorialModal";
import ConfigEditor from './Components/ConfigButton';

import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
})


function App() {

    return (
        <ThemeProvider theme={theme}>
            <MainLogo />
            <TutorialModal />
            <ConfigEditor />
            <Footer />
        </ThemeProvider>
    )
}

export default App
