import {Link} from "react-router-dom";
import AAISS from "../../assets/AAISS.png";
import {useConfig} from "../../providers/config-provider/ConfigProvider.jsx";
import Image from "../image/Image.jsx";
import {Button} from "@mui/material";
import {useState} from "react";

export default function MobileNavbar() {
    const {ROUTES} = useConfig();
    const [_display, set_Display] = useState("none");
    const displayChange = () => {
        if (_display === "none") set_Display("flex");
        else if (_display === "flex") set_Display("none");
    };
    return (
        <div className="mobile-nav-container">
            <div className="mobile-nav">
                <Image
                    src={AAISS}
                    alt={"aaiss logo"}
                    style={{
                        width: "20%",
                        height: "inherit",
                    }}
                />
                <Button color="primary" className="menu-btn" onClick={displayChange}>
                    MENU
                </Button>
            </div>
            <div className="nav-item-container-mobile" style={{display: _display}}>
                {Object.keys(ROUTES).map((name) => {
                    return (
                        <li key={name} className="nav-mobile-list">
                            <Link to={ROUTES[name].path} className="nav-item">{ROUTES[name].title}</Link>
                        </li>
                    );
                })}
            </div>
        </div>
    );
}
