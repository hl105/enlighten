<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

const props = defineProps(["comment"]);
const emit = defineEmits(["refreshComments"]);
const { currentUsername } = storeToRefs(useUserStore());

const route = useRoute();
const forumId = route.params.forumId as string;

const deleteCommentFromForum = async () => {
  try {
    await fetchy(`/api/forums/comments/${forumId}/${props.comment._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshComments");
};
</script>

<template>
  <div class="comment-container">
    <p class="author">{{ props.comment.author }}</p>
    <p class="comment-text">{{ props.comment.text }}</p>
    <div class="base">
      <menu>
        <li v-if="props.comment.author == currentUsername">
          <button class="button-error btn-small pure-button" @click="deleteCommentFromForum">Delete</button>
        </li>
      </menu>
      <article class="timestamp">
        <p v-if="props.comment.dateCreated !== props.comment.dateUpdated">Edited on: {{ formatDate(props.comment.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.comment.dateCreated) }}</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
