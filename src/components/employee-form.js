import { LitElement, html, css } from "lit";
import { store, t } from "../store/store";

export class EmployeeForm extends LitElement {
  static styles = css`
    form {
      display: grid;
      gap: 15px;
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
    input,
    select,
    button {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    input:invalid:not(:placeholder-shown),
    select:invalid:not(:placeholder-shown) {
      border-color: red;
    }
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: -10px;
      margin-bottom: 5px;
      text-align: left;
    }
    button {
      background-color: #e67c3c;
      color: white;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #ff9800;
    }
  `;

  static properties = {
    employee: { type: Object },
    onSave: { type: Function },
    _form: { state: true },
    _errors: { state: true },
  };

  constructor() {
    super();
    this.employee = null;
    this.onSave = () => {};
    this._form = {
      firstName: "",
      lastName: "",
      dateOfEmployment: "",
      dateOfBirth: "",
      phoneNumber: "",
      emailAddress: "",
      department: "",
      position: "",
    };
    this._errors = {};
    this._onStoreChange = () => this.requestUpdate();
    this.lang = store.language;
  }

  connectedCallback() {
    super.connectedCallback();
    store.addEventListener("change", this._onStoreChange);
  }

  disconnectedCallback() {
    store.removeEventListener("change", this._onStoreChange);
    super.disconnectedCallback();
  }

  willUpdate(changedProps) {
    if (changedProps.has("employee") && this.employee) {
      this._form = { ...this.employee };
    }
    if (changedProps.has("employee") && !this.employee) {
      this._form = {
        firstName: "",
        lastName: "",
        dateOfEmployment: "",
        dateOfBirth: "",
        phoneNumber: "",
        emailAddress: "",
        department: "",
        position: "",
      };
    }
  }

  _handleInput(e, key) {
    this._form = { ...this._form, [key]: e.target.value };
    if (this._errors[key]) {
      this._errors = { ...this._errors, [key]: undefined };
    }
    this.requestUpdate();
  }

  _validateForm() {
    const errors = {};
    const phoneRegex = /^(?:\+90)?5\d{9}$/;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!this._form.firstName.trim()) errors.firstName = t("firstNameRequired");
    if (!this._form.lastName.trim()) errors.lastName = t("lastNameRequired");
    if (!this._form.dateOfEmployment)
      errors.dateOfEmployment = t("dateOfEmploymentRequired");
    if (!this._form.dateOfBirth) errors.dateOfBirth = t("dateOfBirthRequired");
    if (!this._form.phoneNumber.trim())
      errors.phoneNumber = t("phoneNumberRequired");
    if (!phoneRegex.test(this._form.phoneNumber.trim()))
      errors.phoneNumber = t("phoneInvalid");
    if (!this._form.emailAddress.trim())
      errors.emailAddress = t("emailAddressRequired");
    if (!emailRegex.test(this._form.emailAddress))
      errors.emailAddress = t("emailAddressInvalid");
    if (!this._form.department) errors.department = t("departmentRequired");
    if (!this._form.position) errors.position = t("positionRequired");

    this._errors = errors;
    return Object.keys(errors).length === 0;
  }

  _handleSubmit(e) {
    e.preventDefault();
    if (this._validateForm()) {
      if (this.employee) {
        const confirmed = window.confirm(t("confirmUpdate"));
        if (!confirmed) return;
      }
      this.onSave({ ...this._form });
    } else {
      console.log("Form has errors:", this._errors);
    }
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit.bind(this)} novalidate>
        <label for="firstName">${t("firstName")}</label>
        <input
          name="firstName"
          placeholder=${t("firstName")}
          .value=${this._form.firstName}
          @input=${(e) => this._handleInput(e, "firstName")}
          required
        />
        ${this._errors.firstName
          ? html`<div class="error-message">${this._errors.firstName}</div>`
          : ""}
        <label for="lastName">${t("lastName")}</label>
        <input
          name="lastName"
          placeholder=${t("lastName")}
          .value=${this._form.lastName}
          @input=${(e) => this._handleInput(e, "lastName")}
          required
        />
        ${this._errors.lastName
          ? html`<div class="error-message">${this._errors.lastName}</div>`
          : ""}
        <label for="dateOfEmployment">${t("dateOfEmployment")}</label>
        <input
          name="dateOfEmployment"
          type="date"
          placeholder=${t("dateOfEmployment")}
          .value=${this._form.dateOfEmployment}
          @input=${(e) => this._handleInput(e, "dateOfEmployment")}
          required
        />
        ${this._errors.dateOfEmployment
          ? html`<div class="error-message">
              ${this._errors.dateOfEmployment}
            </div>`
          : ""}
        <label for="dateOfBirth">${t("dateOfBirth")}</label>
        <input
          name="dateOfBirth"
          type="date"
          placeholder=${t("dateOfBirth")}
          .value=${this._form.dateOfBirth}
          @input=${(e) => this._handleInput(e, "dateOfBirth")}
          required
        />
        ${this._errors.dateOfBirth
          ? html`<div class="error-message">${this._errors.dateOfBirth}</div>`
          : ""}
        <label for="phoneNumber">${t("phoneNumber")}</label>
        <input
          name="phoneNumber"
          placeholder=${t("phoneNumberPlaceholder")}
          .value=${this._form.phoneNumber}
          @input=${(e) => this._handleInput(e, "phoneNumber")}
          required
        />
        ${this._errors.phoneNumber
          ? html`<div class="error-message">${this._errors.phoneNumber}</div>`
          : ""}
        <label for="emailAddress">${t("emailAddress")}</label>
        <input
          name="emailAddress"
          placeholder=${t("emailAddress")}
          .value=${this._form.emailAddress}
          @input=${(e) => this._handleInput(e, "emailAddress")}
          type="email"
          required
        />
        ${this._errors.emailAddress
          ? html`<div class="error-message">${this._errors.emailAddress}</div>`
          : ""}
        <label for="department">${t("department")}</label>
        <select
          name="department"
          .value=${this._form.department}
          @change=${(e) => this._handleInput(e, "department")}
          required
        >
          <option value="">${t("select")}</option>
          <option>Analytics</option>
          <option>Tech</option>
        </select>
        ${this._errors.department
          ? html`<div class="error-message">${this._errors.department}</div>`
          : ""}
        <label for="position">${t("position")}</label>
        <select
          name="position"
          .value=${this._form.position}
          @change=${(e) => this._handleInput(e, "position")}
          required
        >
          <option value="">${t("select")}</option>
          <option>Junior</option>
          <option>Medior</option>
          <option>Senior</option>
        </select>
        ${this._errors.position
          ? html`<div class="error-message">${this._errors.position}</div>`
          : ""}

        <button type="submit">${this.employee ? t("update") : t("add")}</button>
      </form>
    `;
  }
}

customElements.define("employee-form", EmployeeForm);
