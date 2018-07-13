import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

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

  getList() {
    return Axios({
      url: `/api/user`,
      method: 'get'
    }).then(
      res => {
        let list = res.data.data || [];
        list.forEach(item => {
          item.updatedAt = dateFormat(item.updatedAt);
        });
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/user/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  add() {
    return Axios({
      url: `/api/user`,
      method: 'post',
      isFormData: true,
      data: {
        username: this.username,
        password: this.password,
        role: 'admin'
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  changePassword() {
    return Axios({
      url: `/api/user/password?id=${this.id}`,
      method: 'put',
      isFormData: true,
      data: {
        password: this.password
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }
}

