import Axios from './axios'

export default class User {
  constructor(options) {
    options = options || {};
    this.id = options.id || '';
    this.name = options.name || '';
    this.num = options.num || '';
    this.phone = options.phone || '';
    this.role = options.role || '';
    this.introduction = options.introduction || '';
  }


  getInvitedCode() {
    return Axios({
      url: `/api/admin/custom/inviteCode`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  resetInvitedCode() {
    return Axios({
      url: `/api/admin/custom/inviteCode/update`,
      method: 'post'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  editUser() {
    return Axios({
      url: `/api/admin/custom/${this.id}`,
      method: 'put',
      data: {
        name: this.name,
        num: this.num,
        phone: this.phone,
        role: this.role,
        introduction: this.introduction
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  deleteUser() {
    return Axios({
      url: `/api/admin/custom/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  getList(search) {
    return Axios({
      url: `/api/admin/custom`,
      method: 'get',
      params: search,
    }).then(
      res => {
        res.data.data = res.data.data || [];
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }

}
