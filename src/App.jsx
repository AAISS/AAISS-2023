import "./App.css";
import "./css/Nav.css";
import { useState } from "react";
import Home from "./Components/Home";
import { Routes, Route, Link } from "react-router-dom";
import NavItem from "./utils/NavItem";
import FooterNew from "./Components/Footer";
import HeaderNew from "./Components/Header";
import AAISS from "./assets/AAISS.png";
function App() {
  const [sect, setSect] = useState("/");

  return (
    <div className="main">
      <nav className="nav">
      <div className="logo-container">
          <Link to="/" className="logo-item">
            <img
              src={AAISS}
              alt="Logo"
              className="aaiss"
              onClick={() => setSect("/")}
            />
          </Link>
        </div>
        <div className="nav-item-container">
          <NavItem path="/" text="Home" set={setSect} sect={sect} />
          <NavItem path="/About" set={setSect} sect={sect} />
          <NavItem path="/Speakers" set={setSect} sect={sect} />
          <NavItem path="/Workshops" set={setSect} sect={sect} />
          <NavItem path="/Committee" set={setSect} sect={sect} />
          <NavItem path="/Schedule" set={setSect} sect={sect} />
          <NavItem path="/Organizer" set={setSect} sect={sect} />
          <NavItem
            path="/Workshops-and-Presentationst"
            text="All Workshops and Presentations"
            set={setSect}
            sect={sect}
          />
          <NavItem path="/Staff" set={setSect} sect={sect} />
        </div>

      </nav>
      <HeaderNew />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <FooterNew />
    </div>
  );
}

export default App;
