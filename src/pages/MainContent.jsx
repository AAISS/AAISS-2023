import {Route, Routes, useLocation} from "react-router-dom";
import {useConfig} from "../providers/config-provider/ConfigProvider.jsx";
import ForgotPassword from "./ForgotPassword/ForgotPassword.jsx";
import DrawerAppBar from "../Components/app-bar/AppBar.jsx";
import footer from "../assets/footer.png";

export default function MainContent() {
    const {ROUTES} = useConfig();
    const {hash, pathname, search} = useLocation();

    return (
        <div className="main-content">
            <header>
                <DrawerAppBar/>
            </header>
            <main>
                <Routes>
                    {Object.keys(ROUTES).map((name) => {
                        return (
                            <Route
                                path={ROUTES[name].path}
                                element={ROUTES[name]?.component}
                                key={name}
                            />
                        );
                    })}
                    <Route
                        path="/forgotpassword"
                        element={<ForgotPassword/>}
                        key="forgot"
                    />
                </Routes>
            </main>
            {pathname !== '/' &&
                <footer className="footer-new">
                    <img src={footer}/>
                </footer>
            }
        </div>
    );
}
