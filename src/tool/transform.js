export const convertBase64UrlToBlob = function (dataUrl) {
  let bytes = window.atob(dataUrl.split(',')[1]);
  let ab = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    ab[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {type: 'image/png'});
};


export const dateFormat = function (time, flag = false) {
  let date = new Date(time);
  let str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  if (!flag) {
    return str;
  }
  return `${str} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

};
