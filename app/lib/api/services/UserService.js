import { BaseService } from './BaseService';

export class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  async createUser(userData) {
    const formData = new FormData();
    
    // Handle file upload
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        if (key === 'hobbies' && Array.isArray(userData[key])) {
          userData[key].forEach(hobby => formData.append('hobbies[]', hobby));
        } else {
          formData.append(key, userData[key]);
        }
      }
    });

    return await this.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `?${queryString}` : '';
    return await this.get(url);
  }

  async getUserById(id) {
    return await this.get(`/${id}`);
  }

  async updateUser(id, userData) {
    return await this.put(`/${id}`, userData);
  }

  async deleteUser(id) {
    return await this.delete(`/${id}`);
  }

  async searchUsers(searchTerm) {
    return await this.get(`/search?q=${encodeURIComponent(searchTerm)}`);
  }

  async getUserStats() {
    return await this.get('/stats');
  }
}

// Export singleton instance
export const userService = new UserService();