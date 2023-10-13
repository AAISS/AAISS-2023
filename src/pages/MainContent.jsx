import {Route, Routes} from "react-router-dom";
import HeaderNew from "../Components/Header.jsx";
import Home from "../Components/Home.jsx";
import FooterNew from "../Components/Footer.jsx";
import Navbar from "../Components/nav/Navbar.jsx";

export default function MainContent() {

    return (
        <div className="main">
            <Navbar/>
            <HeaderNew/>
            <Routes>
                <Route path="/" element={<Home/>}/>
            </Routes>
            <FooterNew/>
        </div>
    )
}