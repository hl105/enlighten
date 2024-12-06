<script setup lang="ts">
import ForumListComponent from "@/components/Forum/ForumListComponent.vue";
</script>

<template>
  <div class="background"></div>
  <ForumListComponent></ForumListComponent>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: linear-gradient(to bottom, #005eff, #003d99); */
  background-image: url(@/assets/images/wallpaper.png);
  overflow: hidden;
  z-index: -1;
}
</style>