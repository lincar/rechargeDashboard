import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Withdraw {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  agree() {
    return Axios({
      url: `/api/admin/distributor/withdraw/approve`,
      method: 'post',
      isFormData: true,
      data: {
        withdrawId: this.id
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  reject() {
    return Axios({
      url: `/api/admin/distributor/withdraw/reject`,
      method: 'post',
      isFormData: true,
      data: {
        withdrawId: this.id
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList(search) {
    return Axios({
      url: `/api/admin/distributor/withdraw`,
      method: 'get',
      params: search
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
