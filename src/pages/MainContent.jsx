import {Route, Routes} from "react-router-dom";
import HeaderNew from "../Components/Header.jsx";
import Home from "../Components/Home.jsx";
import FooterNew from "../Components/Footer.jsx";
import Navbar from "../Components/nav/Navbar.jsx";
import MobileNavbar from "../Components/nav/MobileNavBar.jsx";
import PresenterCard from "../Components/presenters/PresenterCard.jsx";
import StaffCard from "../Components/staff/StaffCard.jsx";
import Team from "../Components/staff/Team.jsx";
import Presenters from "../Components/presenters/Presenters.jsx";
export default function MainContent() {

    return (
        <div className="main">
            <Navbar/>
            <MobileNavbar/>
            <HeaderNew/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/pctest" element={<PresenterCard/>}/>
                <Route path="/sctest" element={<StaffCard/>}/>
                <Route path="/ttest" element={<Team section="Technical"/>}/>
                <Route path="/ptest" element={<Presenters/>}/>
            </Routes>
            <FooterNew/>
        </div>
    )
}