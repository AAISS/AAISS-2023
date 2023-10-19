import Home from "../../Components/Home.jsx";
import SchedulePage from "../../pages/schedule/SchedulePage.jsx";
import PresenterPage from "../../pages/presenters/PresentersPage.jsx";
const ROUTES = {
    home: {
        path: "/",
        title: "Home",
        component: <Home />
    },
    about: {
        path: "/about",
        title: "About",
    },
    speakers: {
        path: "/speakers",
        title: "Speakers",
    },
    workshops: {
        path: "/workshops",
        title: "Workshops",
    },
    committee: {
        path: "/committee",
        title: "Committee",
        component: <PresenterPage/>
    },
    schedule: {
        path: "/schedule",
        title: "Schedule",
        component: <SchedulePage />
    },
    organizer: {
        path: "/organizer",
        title: "Organizer",
    },
    wnp: {
        path: "/wnp",
        title: "Workshops and Presentations",
    },
    staff: {
        path: "/staff",
        title: "Staff",
    },
}

export default ROUTES