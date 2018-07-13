import Axios from './axios';

export default class Graphic {
  constructor(options) {
    options = options || {};
    this.graphic = options.graphic || {};
  }

  addGraphic() {
    return Axios({
      url: `/api/admin/article`,
      method: 'post',
      data: this.graphic,
      showSuccess: true
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  editGraphic() {
    return Axios({
      url: `/api/admin/article/${this.graphic.id}`,
      method: 'put',
      data: this.graphic,
      showSuccess: true
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  changeGraphicStatus(type) {
    return Axios({
      url: `/api/admin/article/${type}?id=${this.graphic.id}`,
      method: 'post',
      showSuccess: true
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  getGraphic() {
    return Axios({
      url: `/api/admin/article/${this.graphic.id}`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  deleteGraphic() {
    return Axios({
      url: `/api/admin/article/${this.graphic.id}`,
      method: 'delete',
      showSuccess: true
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }


  getGraphicList(search) {
    let params = {};
    params.type = search.type;
    params.pageSize = search.pageSize;
    params.page = search.page;

    if (search.classifyId !== '') {
      params.classifyId = search.classifyId;
    }

    if (search.status !== '') {
      params.status = search.status;
    }

    return Axios({
      url: `/api/admin/article`,
      method: 'get',
      params
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }
}
