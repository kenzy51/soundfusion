import { makeAutoObservable } from "mobx";

class UserStore {
  user: any = null;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== "undefined") {
      this.loadUser(); // Load user only in the browser
    }
  }

  setUser(user: any) {
    this.user = user;
    this.saveUser(); // Save to local storage
  }

  clearUser() {
    this.user = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  }

  isLoggedIn() {
    return !!this.user;
  }

  saveUser() {
    if (typeof window !== "undefined" && this.user) {
      localStorage.setItem("user", JSON.stringify(this.user));
    }
  }

  loadUser() {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  }
}

const userStore = new UserStore();
export default userStore;
