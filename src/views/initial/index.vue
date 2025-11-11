<script>
import {ALL_PERMISSIONS, USER_PERMISSIONS_KEY, DEFAULT_ROLE} from "@/config/settings.js";
import {applyUserRoutes} from "@/router/index.js";

export default {
  beforeMount() {
    this.initUserPermissions()
    this.validateUserPermissions()
  },
  methods: {
    /**
     * 初始化本地存储的用户权限信息
     */
    initUserPermissions() {
      const USER_PERMISSIONS_VALUES = localStorage.getItem(USER_PERMISSIONS_KEY)
      if (!USER_PERMISSIONS_VALUES) {
        localStorage.setItem(USER_PERMISSIONS_KEY, DEFAULT_ROLE)
      }
      const effective_items = ALL_PERMISSIONS.some(item => item.value === USER_PERMISSIONS_VALUES)
      if (!effective_items) {
        localStorage.setItem(USER_PERMISSIONS_KEY, DEFAULT_ROLE)
      }
    },
    /**
     * 验证用户权限是否合法
     */
    validateUserPermissions() {
      const redirectedFrom = this.$route.query.redirectedFrom
      if (localStorage.getItem('currentUserRole') === DEFAULT_ROLE) {
        this.$router.replace({path: '/login'})
      } else {
        applyUserRoutes()
        if (redirectedFrom) {
          this.$router.replace({path: redirectedFrom})
        } else {
          this.$router.replace({path: '/HomeView'})
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
