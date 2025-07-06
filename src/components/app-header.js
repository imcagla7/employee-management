import { Router } from "@vaadin/router";
import { LitElement, html, css } from "lit";

export class AppHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      border-bottom: 2px solid #e0e0e0;
      background: #fff;
      font-family: sans-serif;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 24px;
    }
    .logo {
      font-weight: bold;
      font-size: 18px;
      color: #444;
    }
    .nav {
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .nav-link {
      display: flex;
      align-items: center;
      color: #e67c3c;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      font-size: 16px;
      transition: color 0.2s;
    }
    .nav-link:hover {
      color: #ff9800;
    }
    .divider {
      width: 1px;
      height: 20px;
      background: #e0e0e0;
      margin: 0 12px;
    }
  `;

  render() {
    return html`
      <div class="header">
        <div class="logo">ING</div>
        <div class="nav">
          <span class="nav-link" @click=${() => Router.go("/")}>
            Employees
          </span>
          <span class="divider"></span>
          <span class="nav-link" @click=${() => Router.go("/add-employee")}>
            Add New Employee
          </span>
        </div>
      </div>
    `;
  }
}

customElements.define("app-header", AppHeader);
