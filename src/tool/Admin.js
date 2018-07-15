import Axios from '@/tool/axios.js';

export default class Admin {
  constructor(admin) {
    admin = admin || {};
    this.id = admin.id || -1;
    this.username = admin.username || '';
    this.password = admin.password || '';
  }

  login() {
    const that = this;
    return Axios({
      url: `/api/user/login`,
      method: 'put',
      isFormData: true,
      data: {
        username: that.username,
        password: that.password
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  logout() {
    return Axios({
      url: `/api/user/logout`,
      method: 'put'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getCurrentInfo() {
    return Axios({
      url: `/api/user/current`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }
}

