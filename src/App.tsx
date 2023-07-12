import './App.css'
import MainLogo from "./Components/MainLogo"
import Footer from "./Components/Footer"
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette:{
        mode:'dark'
    }
})


function App() {

    return (
        <ThemeProvider theme={theme}>
            <MainLogo/>
            <Footer />
        </ThemeProvider>
    )
}

export default App
