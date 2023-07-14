import './App.css'
import MainLogo from "./Components/MainLogo"
import Footer from "./Components/Footer"
import CustomModal from "./Components/CustomModal"

import { createTheme, ThemeProvider } from "@mui/material";
import BasicModal from './Components/CustomModal';

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
})


function App() {

    return (
        <ThemeProvider theme={theme}>
            <MainLogo />
            <BasicModal />
            <Footer />
        </ThemeProvider>
    )
}

export default App
