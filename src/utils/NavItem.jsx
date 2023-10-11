import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

const getVariant = (state) => {
    const res = !state ? 'text' : 'outlined'
    return res
}

const NavItem = (props) => {
    return (
        <Link to={props.path} className="nav-item">
          <Button
           variant={getVariant(props.path === props.sect)}
           onClick={() => props.set(props.path)}
           color="secondary"
           >
          {props.text !== undefined ? props.text : props.path.split('/')[1]}
          </Button>
        </Link>
    )
}


export default NavItem;