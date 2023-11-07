import Home from "../../Components/Home.jsx";
import SchedulePage from "../../pages/schedule/SchedulePage.jsx";
import PresenterPage from "../../pages/presenters/PresentersPage.jsx";
import Signup from "../../pages/Signup/Signup.jsx";
import Login from "../../pages/Login/Login.jsx";
import MyAccount from "../../pages/my-account/MyAccount.jsx";
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
        path: "/presenters",
        title: "Presenters",
        component: <PresenterPage/>
    },
    workshops: {
        path: "/workshops",
        title: "Workshops",
    },
    // committee: {
    //     path: "/committee",
    //     title: "Committee",
    // },
    schedule: {
        path: "/schedule",
        title: "Schedule",
        component: <SchedulePage />
    },
    // organizer: {
    //     path: "/organizer",
    //     title: "Organizer",
    // },
    // wnp: {
    //     path: "/wnp",
    //     title: "Workshops and Presentations",
    // },
    staff: {
        path: "/staff",
        title: "Staff",
    },
    history: {
        path: '/history',
        title: 'History'
    },
    signup: {
        path: '/signup',
        title: 'Signup',
        component: <Signup/>
    },
    login: {
        path: '/login',
        title: 'Login',
        component: <Login/>
    },
    myAccount: {
       path: "/my-account",
       title: "My Account",
       component: <MyAccount />
    }
}

export default ROUTES