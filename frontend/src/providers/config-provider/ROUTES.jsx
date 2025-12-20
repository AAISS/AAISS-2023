import Home from '../../pages/Home/Home.jsx';
import MyAccount from '../../pages/my-account/MyAccount.jsx';
import PresenterDetailPage from '../../pages/presenters/PresenterDetailPage.jsx';
import PresenterPage from '../../pages/presenters/PresentersPage.jsx';
import SchedulePage from '../../pages/schedule/SchedulePage.jsx';
import Signup from '../../pages/Signup/Signup.jsx';
import Staff from '../../pages/Staff/Staff.jsx';
import WorkshopsPage from '../../pages/workshops/WorkshopsPage.jsx';

const ROUTES = {
  home: {
    path: '/',
    title: 'Home',
    component: <Home />,
  },
  // speakers: {
  //   path: '/presenters',
  //   title: 'Presenters',
  //   component: <PresenterPage />,
  // },
  speaker: {
    path: '/presenters/:id',
    title: 'Presenter',
    component: <PresenterDetailPage />,
    hideFromAppBar: true,
  },
  talks: {
    path: '/talks',
    title: 'talks',
    component: <WorkshopsPage />,
  },
  // schedule: {
  //   path: '/schedule',
  //   title: 'Schedule',
  //   component: <SchedulePage />,
  // },
  staff: {
    path: '/staff',
    title: 'Staff',
    component: <Staff />,
  },
  signup: {
    path: '/signup',
    title: 'Signup',
    component: <Signup />,
  },
  myAccount: {
    path: '/my-account',
    title: 'My Account',
    component: <MyAccount />,
    hideFromAppBar: true,
  },
};

export default ROUTES;
