<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const title = ref("");
const emit = defineEmits(["updateSearch"]);

const submitSearch = () => {
  emit("updateSearch", {
    author: author.value,
    title: title.value,
  });
};
</script>

<template>
  <form @submit.prevent="submitSearch" class="pure-form">
    <fieldset>
      <legend>Search Forums</legend>
      <input id="author" type="text" v-model="author" placeholder="Author Username" />
      <input id="title" type="text" v-model="title" placeholder="Forum Title" />
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

button {
  background-color: #063970;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #052b5c;
}

fieldset {
  display: flex;
  gap: 1em;
}

legend {
  color: white;
}
</style>
