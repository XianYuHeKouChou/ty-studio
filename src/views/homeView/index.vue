<template>
  <div>
    <div class="grid grid-cols-5 gap-32 px-8">
      <div class="bg-gray-200 p-4">
        <number-flipper :number="50"/>
      </div>
      <div class="bg-gray-200 p-4">列2</div>
      <div class="bg-gray-200 p-4">列3</div>
      <div class="bg-gray-200 p-4">列4</div>
      <div class="bg-gray-200 p-4">列5</div>
    </div>
  </div>
</template>

<script>
import numberFlipper from "./components/numberFlipper.vue";

export default {
  components: {numberFlipper}
}
</script>
