import {Route, Routes} from "react-router-dom";
import FooterNew from "../Components/Footer.jsx";
import Navbar from "../Components/nav/Navbar.jsx";
import MobileNavbar from "../Components/nav/MobileNavBar.jsx";
import {useConfig} from "../providers/config-provider/ConfigProvider.jsx";
import ForgotPassword from "./ForgotPassword/ForgotPassword.jsx";

export default function MainContent() {
    const {
        ROUTES
    } = useConfig()

    return (
        <div className="main">
            <Navbar/>
            <MobileNavbar/>
            <Routes>
                {Object.keys(ROUTES).map(name => {
                    return (
                        <Route
                            path={ROUTES[name].path}
                            element={ROUTES[name]?.component}
                            key={name}
                        />
                    )
                })}
            <Route path="/forgotpassword" element={<ForgotPassword/>} key="forgot"/>
            </Routes>
            <footer>
                <FooterNew/>
            </footer>
        </div>
    )
}