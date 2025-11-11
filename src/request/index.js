/**
 * 通用HTTP请求模块，基于Axios封装
 * - 读取类请求（GET等）：同路径+同参数取消上一条未完成请求
 * - 修改类请求（POST、PUT、DELETE等）：同路径未完成时，拦截新发起的所有同路径请求
 */

import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem('Authorization') || ''
  }
});

// 读取类请求：同路径+同参数取消上一条
const inflightByCompositeKey = new Map();

// 修改类请求：同路径未完成时，拦截不同参数的新请求
const inflightMutationsByPath = new Map();

/**
 * 递归排序对象键，确保稳定的字符串化结果
 * @param obj - 需要排序的对象
 * @return {{}|*}
 */
function sortObject(obj) {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((acc, k) => {
      acc[k] = sortObject(obj[k]);
      return acc;
    }, {});
  }
  return obj;
}

/**
 * 返回稳定的字符串化结果
 * @param {Object} obj - 需要字符串化的对象
 * @return {string}
 */
function stableStringify(obj) {
  try {
    return JSON.stringify(sortObject(obj || {}));
  } catch {
    return '';
  }
}

/**
 * 返回带请求方法的请求路径字符串
 * @param {string} method - HTTP方法
 * @param {string} url - 请求URL
 * @return {string}
 */
function getPathKey(method, url) {
  const base = http.defaults.baseURL;
  const u = new URL(url, base);
  return `${method.toLowerCase()} ${u.origin}${u.pathname}`;
}

/**
 * 返回请求的复合键：路径+参数哈希
 * @param {string} method - HTTP方法
 * @param {string} url - 请求URL
 * @param {string} paramsHash
 * @return {string}
 */
function getCompositeKey(method, url, paramsHash) {
  return `${getPathKey(method, url)}::${paramsHash}`;
}

const MUTATION_METHODS = new Set(['post', 'put', 'delete']);

/**
 * 通用请求：区分读取与修改逻辑
 * @param {Object} config - Axios请求配置
 * @param {string} config.method - HTTP方法
 * @param {string} config.url - 请求URL
 * @param {Object} [config.params] - URL参数
 * @param {Object} [config.data] - 请求体数据
 * @return {Promise<any>}
 */
export function request(config) {
  const method = (config.method || 'get').toLowerCase();
  // 请求路径，修改类方法用此做键
  const pathKey = getPathKey(method, config.url);
  const paramsHash = stableStringify({params: config.params, data: config.data});
  // 请求路径带参数，读取类方法用此做键
  const compositeKey = getCompositeKey(method, config.url, paramsHash);
  const isMutation = MUTATION_METHODS.has(method);
  // 创建AbortController以支持请求取消
  const controller = new AbortController();
  // 将signal添加到请求配置中
  const cfg = {...config, signal: controller.signal};
  // 修改类逻辑：拦截同路径上一次请求未完成就继续发起的请求
  if (isMutation) {
    const prev = inflightMutationsByPath.get(pathKey);
    if (prev && !prev.controller.signal.aborted) {
      const err = new Error(`修改操作被拦截：同一路径存在不同参数的上一个请求未完成：${pathKey}`);
      console.error(err.message);
      return Promise.reject(err);
    }
    inflightMutationsByPath.set(pathKey, {controller});
  } else {
    // 读取类逻辑：取消同路径同参数上一次未完成的请求
    const prev = inflightByCompositeKey.get(compositeKey);
    if (prev && prev.controller && !prev.controller.signal.aborted) {
      console.error(`同一路径和参数的上一个请求未完成，上一个请求被取消：${compositeKey}`);
      prev.controller.abort();
    }
    inflightByCompositeKey.set(compositeKey, {controller});
  }
  return new Promise((resolve, reject) => {
    http.request(cfg)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        const curr = inflightByCompositeKey.get(compositeKey);
        if (curr && curr.controller === controller) {
          if (isMutation) {
            inflightMutationsByPath.delete(pathKey);
          } else {
            inflightByCompositeKey.delete(compositeKey);
          }
        }
      });
  });
}

/**
 * GET请求
 * @param {string} url - 请求URL
 * @param {Object} [params={}] - URL参数
 * @param {Object} [header={}] - 请求头
 * @return {Promise<any>}
 */
function get(url, params = {}, header = {}) {
  return request({url, method: 'get', params, headers: {...header}});
}

/**
 * POST请求
 * @param {string} url - 请求URL
 * @param {Object} [data={}] - 请求体数据
 * @param {Object} [params={}] - URL参数
 * @param {Object} [header={}] - 请求头
 * @return {Promise<any>}
 */
function post(url, data = {}, params = {}, header = {}) {
  return request({url, method: 'post', data, params, headers: {...header}});
}

/**
 * PUT请求
 * @param {string} url - 请求URL
 * @param {Object} [data={}] - 请求体数据
 * @param {Object} [params={}] - URL参数
 * @param {Object} [header={}] - 请求头
 * @return {Promise<any>}
 */
function put(url, data = {}, params = {}, header = {}) {
  return request({url, method: 'put', data, params, headers: {...header}});
}

/**
 * DELETE请求
 * @param {string} url - 请求URL
 * @param {Object} [params={}] - URL参数
 * @param {Object} [header={}] - 请求头
 * @return {Promise<any>}
 */
function del(url, params = {}, header = {}) {
  return request({url, method: 'delete', params, headers: {...header}});
}

export default {get, post, put, delete: del}
