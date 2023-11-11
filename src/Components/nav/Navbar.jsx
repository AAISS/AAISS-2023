import {Link} from "react-router-dom";
import AAISS from "../../assets/AAISS.png";
import NavItem from "./nav-item/NavItem.jsx";
import {useConfig} from "../../providers/config-provider/ConfigProvider.jsx";
import Image from "../image/Image.jsx";

export default function Navbar() {
    const {
        ROUTES,
        setCurrentRoute,
    } = useConfig()

    return (
        <nav className="nav">
            <div className="backdrop-color"></div>
            <div className="logo-container">
                <Link
                    to={ROUTES.home.path}
                    className="logo-item"
                    onClick={() => setCurrentRoute(ROUTES.home)}
                >
                    <Image
                        src={AAISS}
                        alt={"aaiss logo"}
                        style={{
                            width: "45%",
                            height: "inherit"
                        }}
                    />
                </Link>
            </div>
            <div className="nav-item-container">
                {Object.keys(ROUTES).map(name => {
                    return (
                        <NavItem
                            key={name}
                            route={ROUTES[name]}
                        />
                    )
                })}
            </div>
        </nav>
    )
}