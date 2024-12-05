<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const title = ref("");
const description = ref("");

const emit = defineEmits(["refreshForums"]);

const createForum = async () => {
  try {
    await fetchy("/api/forums", "POST", {
      body: {
        title: title.value,
        description: description.value,
      },
    });
  } catch (error) {
    console.error("Something went wrong when creating forum", error);
  }
  emit("refreshForums");
  emptyForm();
};

const emptyForm = () => {
  title.value = "";
  description.value = "";
};
</script>

<template>
  <form @submit.prevent="createForum()">
    <label for="title">Title:</label>
    <textarea id="title" v-model="title" placeholder="Title your forum..." required></textarea>

    <label for="description">Description:</label>
    <textarea id="description" v-model="description" placeholder="Describe your forum..." required></textarea>

    <button type="submit" class="pure-button-primary pure-button">Create Forum</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea,
input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em;
  border-radius: 4px;
}

textarea {
  height: 6em;
  resize: none;
}
</style>
