import { LitElement, html, css } from "lit";
import { store, t } from "../store/store";
import { Router } from "@vaadin/router";
import "../components/employee-form.js";

export class AddEmployee extends LitElement {
  static styles = css`
    h2 {
      color: #e67c3c;
      margin-bottom: 20px;
      text-align: center;
    }
  `;

  _handleSave = (employee) => {
    store.add(employee);
    Router.go("/");
  };

  render() {
    return html`
      <h2>${t("addNew")}</h2>
      <employee-form
        .employee=${null}
        .onSave=${this._handleSave}
      ></employee-form>
    `;
  }
}
customElements.define("add-employee", AddEmployee);
