<template>
  <div class="h-full flex justify-center items-center">
    <div class="flex-col gap-4 w-full flex items-center justify-center">
      <div
        class="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
        <div
          class="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import {USER_PERMISSIONS_KEY, DEFAULT_ROLE} from "@/config/settings.js";
import {applyUserRoutes} from "@/router/index.js";

export default {
  inject: ['store'],
  mounted() {
    setTimeout(() => {
      this.initUserPermissions()
    }, 0)
  },
  methods: {
    /**
     * 初始化本地存储的用户权限信息
     */
    initUserPermissions() {
      this.store().loadUserRole()
      const redirectedFrom = this.$route.query.redirectedFrom
      if (this.store()[USER_PERMISSIONS_KEY] === DEFAULT_ROLE) {
        this.$router.replace({path: '/login'})
      } else {
        applyUserRoutes()
        if (redirectedFrom) {
          this.$router.replace({path: redirectedFrom})
        } else {
          this.$router.replace({path: '/homeView'})
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
