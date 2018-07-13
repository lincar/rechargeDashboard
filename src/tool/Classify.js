import Axios from './axios';

export default class Classify {
  constructor(options) {
    options = options || {};
    this.classify = options.classify || {};
  }

  addClassify() {
    return Axios({
      url: `/api/admin/article/classify`,
      method: 'post',
      data: this.classify,
      showSuccess: true
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  editClassify(id){
    return Axios({
      url: `/api/admin/article/classify/${id}`,
      method: 'put',
      data: this.classify,
      showSuccess: true
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  deleteClassify() {
    return Axios({
      url: `/api/admin/article/classify/${this.classify.id}`,
      method: 'delete',
      showSuccess: true
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  getClassify() {
    return Axios({
      url: `/api/admin/article/classify/${this.classify.id}`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getClassifyListByName(name) {
    return Axios({
      url: `/api/admin/article/classifyByName?name=${name}`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  getClassifyList(superId) {
    let params = {};
    superId && (params.superId = superId);
    return Axios({
      url: `/api/admin/article/classify`,
      method: 'get',
      params: params
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }
}
