<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const route = useRoute();
const forumId = route.params.forumId as string;
const forumTitle = route.params.forumTitle as string;

const text = ref("");

const emit = defineEmits(["refreshComments"]);

const addCommentToForum = async () => {
  try {
    await fetchy(`/api/forums/comments/${forumId}/${forumTitle}`, "POST", {
      body: {
        forumId: forumId,
        text: text.value,
      },
    });
  } catch (error) {
    console.error("Something went wrong when adding comment to forum", error);
  }
  emit("refreshComments");
  emptyForm();
};

const emptyForm = () => {
  text.value = "";
};
</script>

<template>
  <form @submit.prevent="addCommentToForum()">
    <label for="title">Title:</label>
    <textarea id="text" v-model="text" placeholder="Write your comment..." required></textarea>

    <button type="submit">Create Comment</button>
  </form>
</template>

<style scoped>
form {
  background: rgba(0, 0, 0, 0.5);
  /* background-color: var(--base-bg); */
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  width: 30em;
  color: white;
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

button {
  background-color: #063970;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 13em;
  margin-left: 25%;
  font-family: "Catalina";
}

button:hover {
  background-color: #052b5c;
}
</style>
