<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const location = ref("");
const hashtags = ref("");
const emit = defineEmits(["updateSearch"]);

const submitSearch = () => {
  emit("updateSearch", {
    author: author.value,
    location: location.value,
    hashtags: hashtags.value,
  });
};
</script>

<template>
  <form @submit.prevent="submitSearch" class="pure-form">
    <fieldset>
      <legend>Search Posts</legend>
      <input id="author" type="text" v-model="author" placeholder="Author Username" />
      <input id="location" type="text" v-model="location" placeholder="Location (x,y)" />
      <input id="hashtags" type="text" v-model="hashtags" placeholder="Hashtags (comma-separated)" />
      <button type="submit" class="pure-button pure-button-primary">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
</style>
