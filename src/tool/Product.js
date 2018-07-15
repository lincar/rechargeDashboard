import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Product {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    return Axios({
      url: `/api/admin/recharge/product`,
      method: 'post',
      data: {
        seq: 1,
        name: this.name,
        price: this.price * 100,
        code: this.code,
        type: this.type
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    return Axios({
      url: `/api/admin/recharge/product/${this.id}`,
      method: 'put',
      data: {
        name: this.name,
        price: this.price * 100,
        code: this.code,
        type: this.type
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/recharge/product/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList() {
    return Axios({
      url: `/api/admin/recharge/product`,
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
