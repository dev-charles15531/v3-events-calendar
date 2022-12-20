<script setup>
import Calendar from "./components/Calendar.vue";
</script>

<template>
  <div
    class="h-screen w-full flex items-center justify-center overflow-y-scroll"
  >
    <div class="w-full h-full">
      <div class="w-full">
        <h3 class="w-full text-lg text-center font-extrabold text-green-400">
          Hello Vue + tailwind
        </h3>
      </div>

      <div class="w-full mt-5 px-4">
        <Calendar />
      </div>
    </div>
  </div>
</template>
