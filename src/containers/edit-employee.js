import { LitElement, html, css } from "lit";
import { store, t } from "../store/store";
import "../components/employee-form.js";
import { Router } from "@vaadin/router";

export class EditEmployee extends LitElement {
  static styles = css`
    h2 {
      color: #e67c3c;
      margin-bottom: 20px;
      text-align: center;
    }
  `;

  static properties = {
    employeeId: { type: Number },
    employee: { type: Object },
  };

  constructor() {
    super();
    this.employeeId = null;
    this.employee = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const match = window.location.pathname.match(/\/edit-employee\/(\d+)/);
    if (match) {
      this.employeeId = Number(match[1]);
      this.employee = store.getById(this.employeeId);
    }
  }

  _handleSave = (updated) => {
    store.edit(this.employeeId, updated);
    Router.go("/");
  };

  render() {
    if (!this.employee) return html`<p>${t("employeeNotFound")}</p>`;
    return html`
      <h2>
        "${this.employee.firstName} ${this.employee.lastName}"
        ${t("updatingInformation")}
      </h2>
      <employee-form
        .employee=${this.employee}
        .onSave=${this._handleSave}
      ></employee-form>
    `;
  }
}
customElements.define("edit-employee", EditEmployee);
