import { Router } from "@vaadin/router";
import { LitElement, html, css } from "lit";
import { store, t } from "../store/store";

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
    .flag-btn {
      cursor: pointer;
      font-size: 20px;
      color: #444;
      transition: color 0.2s;
      padding: 4px 10px;
      border-radius: 4px;
    }
    .flag-btn:hover {
      background-color: #dedddd;
    }
    .flag-btn.active {
      border: 1px solid #e67c3c;
      background: #fff3e0;
    }
  `;

  constructor() {
    super();
    this._onStoreChange = () => this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    store.addEventListener("change", this._onStoreChange);
  }

  disconnectedCallback() {
    store.removeEventListener("change", this._onStoreChange);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="header">
        <div class="logo">ING</div>
        <div class="nav">
          <span class="nav-link" @click=${() => Router.go("/")}>
            ${t("employees")}
          </span>
          <span class="divider"></span>
          <span class="nav-link" @click=${() => Router.go("/add-employee")}>
            ${t("addNew")}
          </span>
          <span class="divider"></span>
          <div class="button-group">
            <span
              class="flag-btn ${store.getLanguage() === "tr" ? "active" : ""}"
              @click=${() => store.setLanguage("tr")}
              >🇹🇷</span
            >
            <span
              class="flag-btn ${store.getLanguage() === "en" ? "active" : ""}"
              @click=${() => store.setLanguage("en")}
              >🇬🇧</span
            >
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("app-header", AppHeader);
