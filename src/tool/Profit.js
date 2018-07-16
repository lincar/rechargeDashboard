import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Profit {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  getList(search) {
    return Axios({
      url: `/api/admin/distributor/profit`,
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
