import { LitElement, html, css } from "lit";
import "./components/app-header.js";
import "./containers/employee-list.js";
import { Router } from "@vaadin/router";
import { routes } from "./routes";

class EmployeesApp extends LitElement {
  static properties = {
    message: { type: String },
  };

  constructor() {
    super();
    this.message = "Employees App";
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    const outlet = this.querySelector("#outlet");
    const router = new Router(outlet);
    router.setRoutes(routes);
  }

  render() {
    return html`
      <app-header></app-header>
      <div id="outlet"></div>
    `;
  }
}

customElements.define("employees-app", EmployeesApp);
