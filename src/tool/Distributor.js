import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Distributor {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    return Axios({
      url: `/api/admin/distributor`,
      method: 'post',
      data: {
        name: this.name,
        phone: this.phone,
        profit: this.profit / 100,
        username: this.username,
        password: this.password
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    return Axios({
      url: `/api/admin/distributor/${this.id}`,
      method: 'put',
      data: {
        name: this.name,
        phone: this.phone,
        profit: this.profit / 100,
        username: this.username
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/distributor/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList() {
    return Axios({
      url: `/api/admin/distributor`,
      method: 'get'
    }).then(
      res => {
        res.data.data = res.data.data || [];
        let list = res.data.data;
        list.map(item => {
          item.createdAt = dateFormat(item.createdAt);
        });
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }
}
