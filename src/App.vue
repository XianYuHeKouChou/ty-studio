<template>
  <el-container class="h-screen">
    <el-header v-show="!isFullscreen">
      <HeaderMenu/>
    </el-header>
    <el-container>
      <el-aside v-show="!isFullscreen" width="200px">
        <AsideMenu/>
      </el-aside>
      <el-main style="padding: 0">
        <RouterView/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import HeaderMenu from "@/components/HeaderMenu.vue";
import AsideMenu from "@/components/AsideMenu.vue";
import {USER_PERMISSIONS_KEY, ALL_PERMISSIONS} from "@/config/settings.js";

export default {
  components: {
    HeaderMenu,
    AsideMenu
  },
  computed: {
    isFullscreen() {
      return this.$route?.meta?.fullscreen === true
    }
  },
  mounted() {
    const USER_PERMISSIONS_VALUES = localStorage.getItem(USER_PERMISSIONS_KEY)
    if (!USER_PERMISSIONS_VALUES) {
      localStorage.setItem(USER_PERMISSIONS_KEY, 'Unauthorized')
    }
    const effective_items = ALL_PERMISSIONS.some(item => item.value === USER_PERMISSIONS_VALUES)
    if (!effective_items) {
      localStorage.setItem(USER_PERMISSIONS_KEY, 'Unauthorized')
    }
  }
}
</script>


<style scoped>
</style>
