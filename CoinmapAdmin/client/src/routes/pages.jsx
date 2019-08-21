import LoginPage from "views/Pages/LoginPage.jsx";
import { route } from '../config';


const pagesRoutes = [
  {
    path: route.LOGIN_ROUTE,
    name: "Login",
    short: "Login",
    mini: "L",
    icon: "users_circle-08",
    component: LoginPage
  },
];

export default pagesRoutes;
