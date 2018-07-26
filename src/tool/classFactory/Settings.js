import Axios from '@/tool/axios.js';

export default class Settings {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  edit() {
    return Axios({
      url: `/api/admin/setting`,
      method: 'post',
      data: {
        k: this.key,
        v: this.value,
        type: this.type
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  getList() {
    return Axios({
      url: `/api/setting/list`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }
}
