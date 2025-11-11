export default {
  //储存数据到本地
  setLocalStorage(key, value) {
    localStorage.setItem(key, value)
  },
  //获取本地数据
  getLocalStorage(key) {
    return localStorage.getItem(key)
  },
  //清除本地数据
  clearLocalStorage(key) {
    localStorage.removeItem(key)
  },
  /**
   * 获取图片的URL
   * @param {string} imageName - 图片名称
   * @returns {string} - 图片的URL
   */
  getImageUrl(imageName) {
    return new URL(`../static/${imageName}`, import.meta.url).href;
  },
};
