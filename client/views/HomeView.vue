<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const { currentUsername } = useUserStore();
</script>

<template>
  <main>
    <section>
      <div class="logged-in">
        <h1>Welcome, {{ currentUsername }}!</h1>
      </div>
    </section>
  </main>
</template>

<style scoped>
.logged-in {
  text-align: center;
  margin-top: 2rem;
}
</style>
