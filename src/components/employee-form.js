import { LitElement, html, css } from "lit";

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
    employee: { type: Object }, // null ise add, dolu ise edit
    onSave: { type: Function },
    _form: { state: true }, // Form verilerini reaktif hale getir
    _errors: { state: true }, // Hata mesajlarını tut
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
    // Input değiştikçe ilgili hatayı temizle
    if (this._errors[key]) {
      this._errors = { ...this._errors, [key]: undefined };
    }
    this.requestUpdate();
  }

  _validateForm() {
    const errors = {};
    // Basit boşluk kontrolü
    if (!this._form.firstName.trim())
      errors.firstName = "First Name is required.";
    if (!this._form.lastName.trim()) errors.lastName = "Last Name is required.";
    if (!this._form.dateOfEmployment)
      errors.dateOfEmployment = "Date of Employment is required.";
    if (!this._form.dateOfBirth)
      errors.dateOfBirth = "Date of Birth is required.";
    if (!this._form.phoneNumber.trim())
      errors.phoneNumber = "Phone Number is required.";
    if (!this._form.emailAddress.trim())
      errors.emailAddress = "Email Address is required.";
    else if (!/\S+@\S+\.\S+/.test(this._form.emailAddress))
      errors.emailAddress = "Invalid email format.";

    // Departman ve Pozisyon için de kontrol eklenebilir, ama select olduğu için genelde boş olmaz

    this._errors = errors;
    return Object.keys(errors).length === 0; // Hata yoksa true döner
  }

  _handleSubmit(e) {
    e.preventDefault();
    if (this._validateForm()) {
      this.onSave({ ...this._form });
    } else {
      console.log("Form has errors:", this._errors);
      // Hataları kullanıcıya göstermek için bir yol bul
      // Örneğin, ilk hataya scroll etme veya hata mesajlarını görünür yapma
    }
  }

  render() {
    return html`
      <form @submit=${this._handleSubmit.bind(this)}>
        <input
          placeholder="First Name"
          .value=${this._form.firstName}
          @input=${(e) => this._handleInput(e, "firstName")}
          required
        />
        ${this._errors.firstName
          ? html`<div class="error-message">${this._errors.firstName}</div>`
          : ""}

        <input
          placeholder="Last Name"
          .value=${this._form.lastName}
          @input=${(e) => this._handleInput(e, "lastName")}
          required
        />
        ${this._errors.lastName
          ? html`<div class="error-message">${this._errors.lastName}</div>`
          : ""}

        <input
          type="date"
          placeholder="Date of Employment"
          .value=${this._form.dateOfEmployment}
          @input=${(e) => this._handleInput(e, "dateOfEmployment")}
          required
        />
        ${this._errors.dateOfEmployment
          ? html`<div class="error-message">
              ${this._errors.dateOfEmployment}
            </div>`
          : ""}

        <input
          type="date"
          placeholder="Date of Birth"
          .value=${this._form.dateOfBirth}
          @input=${(e) => this._handleInput(e, "dateOfBirth")}
          required
        />
        ${this._errors.dateOfBirth
          ? html`<div class="error-message">${this._errors.dateOfBirth}</div>`
          : ""}

        <input
          placeholder="Phone Number"
          .value=${this._form.phoneNumber}
          @input=${(e) => this._handleInput(e, "phoneNumber")}
          required
        />
        ${this._errors.phoneNumber
          ? html`<div class="error-message">${this._errors.phoneNumber}</div>`
          : ""}

        <input
          placeholder="Email Address"
          .value=${this._form.emailAddress}
          @input=${(e) => this._handleInput(e, "emailAddress")}
          type="email"
          required
        />
        ${this._errors.emailAddress
          ? html`<div class="error-message">${this._errors.emailAddress}</div>`
          : ""}

        <select
          .value=${this._form.department}
          @change=${(e) => this._handleInput(e, "department")}
          required
        >
          <option value="">Select Department</option>
          <option>Analytics</option>
          <option>Tech</option>
        </select>
        ${this._errors.department
          ? html`<div class="error-message">${this._errors.department}</div>`
          : ""}

        <select
          .value=${this._form.position}
          @change=${(e) => this._handleInput(e, "position")}
          required
        >
          <option value="">Select Position</option>
          <option>Junior</option>
          <option>Medior</option>
          <option>Senior</option>
        </select>
        ${this._errors.position
          ? html`<div class="error-message">${this._errors.position}</div>`
          : ""}

        <button type="submit">${this.employee ? "Update" : "Add"}</button>
      </form>
    `;
  }
}

customElements.define("employee-form", EmployeeForm);
