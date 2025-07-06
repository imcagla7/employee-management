import { locales } from "../localization/translations.js";
import { defaultEmployees } from "./employees-data.js";

const STORAGE_KEY = "employees";
const LANG_KEY = "lang";

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

function loadLanguage() {
  return localStorage.getItem(LANG_KEY) || "en";
}

function saveLanguage(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

class Store extends EventTarget {
  constructor() {
    super();
    this.employees = loadEmployees();
    this.currentLang = loadLanguage();
    document.documentElement.lang = this.currentLang;
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

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (["en", "tr"].includes(lang) && this.currentLang !== lang) {
      this.currentLang = lang;
      document.documentElement.lang = lang;
      saveLanguage(lang);
      this.dispatchEvent(new Event("change"));
    }
  }

  t(key) {
    return locales[this.currentLang][key] || key;
  }
}

export const store = new Store();
export const t = store.t.bind(store);
