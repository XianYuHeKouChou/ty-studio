import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {WarningFilled} from "@element-plus/icons-vue";
import {markRaw} from "vue";

export default {
  /**
   * 成功Message提示
   * @param msg {string} - 提示信息
   */
  successMessage(msg) {
    ElMessage({
      message: msg, type: "success", plain: true,
    });
  },
  /**
   * 失败Message提示
   * @param msg {string} - 提示信息
   */
  failMessage(msg) {
    ElMessage({
      message: msg, type: "error", plain: true,
    });
  },
  /**
   * 成功Notification通知
   * @param msg {string} - 提示信息
   */
  successNotification(msg) {
    ElNotification({
      title: '操作成功',
      message: msg,
      type: 'success',
    })
  },
  /**
   * 失败Notification通知
   * @param msg {string} - 提示信息
   */
  failNotification(msg) {
    ElNotification({
      title: '操作失败',
      message: msg,
      type: 'error',
    })
  },
  /**
   * 弹出警告提示框
   * @param {string} title - 提示框标题
   * @param {string} msg - 提示信息
   * @return {Promise} - 返回一个Promise对象，确认时resolve，取消时reject
   */
  warningMessage(title, msg) {
    return new Promise((resolve, reject) => {
      ElMessageBox.confirm(msg, title, {
        confirmButtonText: '确认', cancelButtonText: '取消',
        type: 'warning',
        center: true,
        icon: markRaw(WarningFilled),
      })
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    })
  },
  /**
   * 弹出输入提示框
   * @param {string} title - 提示框标题
   * @param {string} msg - 提示信息
   * @return {Promise} - 返回一个Promise对象，输入值时resolve，取消时reject
   */
  dialogInput(title, msg) {
    return new Promise((resolve, reject) => {
      ElMessageBox.prompt(msg, title, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: true
      })
        .then(({value}) => {
          resolve(value);
        })
        .catch(() => {
          reject();
        })
    })
  }
};
