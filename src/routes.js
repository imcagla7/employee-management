import "./containers/employee-list.js";
import "./containers/add-employee.js";
import "./containers/edit-employee.js";

export const routes = [
  {
    path: "/",
    component: "employee-list",
    name: "employee-list",
  },
  {
    path: "/add-employee",
    component: "add-employee",
    name: "add-employee",
  },
  {
    path: "/edit-employee/:id",
    component: "edit-employee",
    name: "edit-employee",
  },
  { path: "(.*)", component: "employee-list" },
];
