const scrollFixeder = (function () {
  let tryTimes = 0;
  let maxTimes = 10;
  return {
    addFixed(superName, childName, correctRect, handler) {
      const that = this;
      let superEl = document.querySelector(superName);
      let childEl = document.querySelector(childName);
      if (superEl && childEl) {
        let oldScrollTop = superEl.scrollTop;
        correctRect.top = correctRect.top || 0;
        correctRect.left = correctRect.left || 0;
        correctRect.width = correctRect.width || 0;
        superEl.scrollTop = 0;
        let superRect = superEl.getBoundingClientRect();
        let childRect = childEl.getBoundingClientRect();
        let len = childRect.top - superRect.top;
        handler = handler || function () {
          childEl = document.querySelector(childName);
          if (!childEl) {
            superEl.removeEventListener('scroll', handler);
            return false;
          }

          if (superEl.scrollTop >= len) {
            childEl.style.position = 'fixed';
            childEl.style.top = superRect.top + correctRect.top + 'px';
            childEl.style.left = childRect.left + correctRect.left + 'px';
            childEl.style.width = childRect.width + correctRect.width + 'px';
            childEl.style.zIndex = 2;
          } else {
            childEl.style.position = 'static';
            childEl.style.zIndex = 'auto';
          }
        };
        superEl.addEventListener('scroll', handler);
        superEl.scrollTop = oldScrollTop;
        return that;
      } else {
        if (tryTimes++ < maxTimes) {
          setTimeout(function () {
            that.addFixed(superName, childName, handler);
          }, 500);
        }
      }
    }
  }
})();

export default {
  scrollFixeder,
}
