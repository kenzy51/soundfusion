import { makeAutoObservable } from "mobx";

class UserStore {
  user: { [key: string]: any } | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true }); 
    if (typeof window !== "undefined") {
      this.loadUser();
    }
  }

  setUser(user: { [key: string]: any } | null) {
    this.user = user;
    this.saveUser();
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
      try {
        this.user = userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error("Error parsing user data:", error);
        this.user = null;
      }
    }
  }
}

const userStore = new UserStore();
export default userStore;
