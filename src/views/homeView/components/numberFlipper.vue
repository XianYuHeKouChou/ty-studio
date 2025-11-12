<template>
  <BorderBox-12 class="w-full h-full p-4">
    <div class="flex flex-col items-center justify-center">
      <div class="flex items-end">
        <digital-flop :config="config" class="w-3/5"/>
        <span class="text-base">个</span>
      </div>
      <span class="mt-3 text-center text-xl font-bold text-[#797979]">进行中项目</span>
    </div>
  </BorderBox-12>
</template>

<script>
import {BorderBox12, DigitalFlop} from "@kjgl77/datav-vue3"

export default {
  name: "numberFlipper",
  components: {BorderBox12, DigitalFlop},
  props: {
    number: {
      type: Number,
      default: 0
    },
    fontSize: {
      type: Number,
      default: 50
    },
  },
  computed: {
    config() {
      return {
        number: [this.number],
        content: ``,
        style: {
          fontSize: this.fontSize,
          fill: '#2BAEC4'
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
