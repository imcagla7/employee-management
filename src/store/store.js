import { defaultEmployees } from "./employees-data.js";

const STORAGE_KEY = "employees";

function loadEmployees() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return [...defaultEmployees];
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
  return [...defaultEmployees];
}

function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

class Store extends EventTarget {
  constructor() {
    super();
    this.employees = loadEmployees();
  }

  getAll() {
    return [...this.employees];
  }

  add(employee) {
    employee.id = Date.now();
    this.employees = [...this.employees, employee];
    saveEmployees(this.employees);
    this.dispatchEvent(new Event("change"));
  }

  edit(id, updated) {
    this.employees = this.employees.map((emp) =>
      emp.id === id ? { ...emp, ...updated } : emp
    );
    saveEmployees(this.employees);
    this.dispatchEvent(new Event("change"));
  }

  delete(id) {
    this.employees = this.employees.filter((emp) => emp.id !== id);
    saveEmployees(this.employees);
    this.dispatchEvent(new Event("change"));
  }

  getById(id) {
    return this.employees.find((emp) => emp.id === id);
  }
}

export const store = new Store();
