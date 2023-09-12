import './App.css'
import MainLogo from "./Components/MainLogo"
import Footer from "./Components/Footer"
import AlertDialog from "./Components/CustomModal"

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
            <AlertDialog />
            <Footer />
        </ThemeProvider>
    )
}

export default App
