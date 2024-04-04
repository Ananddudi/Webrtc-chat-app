import axios from "axios";
import { toast } from "react-hot-toast";

class Api {
  constructor() {
    this.instance = axios.create({
      baseURL: "/api",
      // timeout: 2000,
    });
  }

  error(message, className = "", duration = 3) {
    this.toast = toast.error(message, {
      duration: 1000 * duration,
      className,
    });
  }
  success(message, className = "", duration = 3) {
    this.toast = toast.success(message, {
      duration: 1000 * duration,
      className,
    });
  }

  async post({ url, data }) {
    const result = await this.instance({
      url,
      data,
      method: "POST",
    });
    return result;
  }

  async put({ url, data }) {
    const result = await this.instance({
      url,
      data,
      method: "PUT",
    });
    return result;
  }

  async delete({ url }) {
    const data = await this.instance({
      url,
      method: "DELETE",
    });
    return data;
  }

  async get({ url }) {
    const data = await this.instance({
      url,
      method: "GET",
    });
    return data;
  }
}

const axiosapi = new Api();

export default axiosapi;
