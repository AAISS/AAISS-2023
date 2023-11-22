import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import useNavItem from "./useNavItem.js";
import {useConfig} from "../../../providers/config-provider/ConfigProvider.jsx";

export default function NavItem({
                                    route,
                                }) {

    const {
        getVariant,
    } = useNavItem();

    const {
        currentRoute,
        setCurrentRoute,
    } = useConfig()


    return (
        <Link to={route.path} className="nav-item">
            <Button
                variant={getVariant(route.path, currentRoute.path)}
                onClick={() => setCurrentRoute(route)}
                color="primary"
            >
                {route.title}
            </Button>
        </Link>
    )
}