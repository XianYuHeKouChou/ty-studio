import {defineStore} from 'pinia'

import {USER_PERMISSIONS_KEY, DEFAULT_ROLE, PERMISSION_VALUES} from "@/config/settings.js";

export const useCounterStore = defineStore('counter', {
  state: () => {
    return {
      [USER_PERMISSIONS_KEY]: DEFAULT_ROLE
    }
  },
  actions: {
    /**
     * 从本地存储加载用户权限
     */
    loadUserRole() {
      const storedRole = localStorage.getItem(USER_PERMISSIONS_KEY);
      if (storedRole && Object.values(PERMISSION_VALUES).includes(storedRole)) {
        this[USER_PERMISSIONS_KEY] = storedRole;
      } else {
        localStorage.setItem(USER_PERMISSIONS_KEY, DEFAULT_ROLE);
        this[USER_PERMISSIONS_KEY] = DEFAULT_ROLE;
      }
    },
    /**
     * 设置当前用户权限
     * @param {keyof typeof PERMISSION_VALUES} role - 用户权限，必须是 PERMISSION_VALUES 的其中一项
     */
    setUserRole(role) {
      if (!Object.values(PERMISSION_VALUES).includes(role)) {
        return console.error('设置用户权限失败：无效的权限值')
      }
      this[USER_PERMISSIONS_KEY] = role;
      localStorage.setItem(USER_PERMISSIONS_KEY, role);
    }
  }
})
