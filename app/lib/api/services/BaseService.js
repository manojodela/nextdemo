import axiosClient from '../axiosClient';

export class BaseService {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.client = axiosClient;
  }

  async get(url, config = {}) {
    try {
      const response = await this.client.get(`${this.baseURL}${url}`, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(`${this.baseURL}${url}`, data, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(`${this.baseURL}${url}`, data, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(`${this.baseURL}${url}`, config);
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || error.message,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        status: 0,
        message: 'Network error - please check your connection',
        data: null
      };
    } else {
      return {
        status: -1,
        message: error.message,
        data: null
      };
    }
  }
}