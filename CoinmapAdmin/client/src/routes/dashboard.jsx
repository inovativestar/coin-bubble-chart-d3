import Account from "views/Pages/AccountPage.jsx";
import FormPage from "views/Pages/FormPage.jsx";
import Hierarchy from "views/Pages/HierarchyPage.jsx";

var dashRoutes = [
  {
    path: "/hierarchy",
    name: "Hierarchy",
    mini: "H",
    component: Hierarchy,
    icon: "design_bullet-list-67"
  },
  {
    path: "/account",
    name: "Account",
    mini: "A",
    component: Account,
    icon: "users_single-02"
  },
  {
    path: "/form",
    name: "Form",
    mini: "F",
    component: FormPage,
    hidden: true
  },

  { redirect: true, path: "/", pathTo: "/hierarchy", name: "Dashboard" }
];
export default dashRoutes;
