<template>
  <span>你是个人</span>
</template>

<script>
import {applyUserRoutes} from "@/router/index.js";

export default {
  mounted() {
    const redirectedFrom = this.$route.query.redirectedFrom
    if (localStorage.getItem('currentUserRole') === 'Unauthorized') {
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
</script>

<style scoped>

</style>
