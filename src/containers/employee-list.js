import { LitElement, html, css } from "lit";
import { store, t } from "../store/store";
import { Router } from "@vaadin/router";

export class EmployeeList extends LitElement {
  static styles = css`
    .table-container {
      max-width: 90vw;
      margin: 30px auto;
      padding: 24px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
      overflow-x: auto;
    }
    h2 {
      margin-top: 0;
      color: #e67c3c;
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }
    th,
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #eee;
      text-align: left;
      font-size: 15px;
    }
    th {
      background: #f3f3f3;
      color: #e67c3c;
      font-weight: 600;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .actions {
      display: flex;
      gap: 8px;
    }
    button {
      color: white;
      border: none;
      border-radius: 4px;
      padding: 6px 14px;
      font-size: 15px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .edit-button {
      background-color: #4caf50;
    }
    .delete-button {
      background-color: #f44336;
    }
    .edit-button:hover {
      background-color: #7bcc7e;
    }
    .delete-button:hover {
      background-color: #ee7067;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
    }
    .pagination button {
      padding: 6px 14px;
      border-radius: 4px;
      border: 1px solid #e67c3c;
      background: #fff;
      color: #e67c3c;
      cursor: pointer;
      font-size: 15px;
      transition: background 0.2s;
    }
    .pagination button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pagination span {
      font-weight: 500;
      color: #444;
    }
    .search-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .search-container {
      display: flex;
    }
  `;

  static properties = {
    employees: { type: Array },
    currentPage: { state: true },
    pageSize: { state: true },
    searchQuery: { state: true },
  };

  constructor() {
    super();
    this.employees = store.getAll();
    this.currentPage = 1;
    this.pageSize = 10;
    this.searchQuery = "";
    this._onChange = () => {
      this.employees = store.getAll();
      this.currentPage = 1;
    };
  }

  connectedCallback() {
    super.connectedCallback();
    store.addEventListener("change", this._onChange);
  }

  disconnectedCallback() {
    store.removeEventListener("change", this._onChange);
    super.disconnectedCallback();
  }

  get filteredEmployees() {
    if (!this.searchQuery) return this.employees;
    const q = this.searchQuery.trim().toLowerCase();
    return this.employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(q) ||
        emp.lastName.toLowerCase().includes(q)
    );
  }

  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

  get pagedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  _edit(id) {
    Router.go(`/edit-employee/${id}`);
  }

  _delete(id) {
    if (confirm("Are you sure you want to delete this employee?")) {
      store.delete(id);
      this.employees = store.getAll();
    }
  }

  render() {
    return html`<div class="table-container">
      <h2>${t("employeeList")}</h2>
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="${t("searchByName")}"
          .value=${this.searchQuery}
          @input=${(e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
          }}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>${t("firstName")}</th>
            <th>${t("lastName")}</th>
            <th>${t("dateOfEmployment")}</th>
            <th>${t("dateOfBirth")}</th>
            <th>${t("phoneNumber")}</th>
            <th>${t("emailAddress")}</th>
            <th>${t("department")}</th>
            <th>${t("position")}</th>
            <th>${t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          ${this.pagedEmployees.map(
            (emp) => html`
              <tr>
                <td>${emp.firstName}</td>
                <td>${emp.lastName}</td>
                <td>${emp.dateOfEmployment}</td>
                <td>${emp.dateOfBirth}</td>
                <td>${emp.phoneNumber}</td>
                <td>${emp.emailAddress}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td class="actions">
                  <button
                    class="edit-button"
                    @click=${() => this._edit(emp.id)}
                  >
                    ${t("edit")}
                  </button>
                  <button
                    class="delete-button"
                    @click=${() => this._delete(emp.id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
      <div class="pagination">
        <button
          ?disabled=${this.currentPage === 1}
          @click=${() => this.currentPage--}
        >
          ${t("prev")}
        </button>
        <span> ${this.currentPage} / ${this.totalPages} </span>
        <button
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this.currentPage++}
        >
          ${t("next")}
        </button>
      </div>
    </div>`;
  }
}
customElements.define("employee-list", EmployeeList);
