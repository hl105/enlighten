<script setup lang="ts">
import CommentComponent from "@/components/Forum/CommentComponent.vue";
import CreateCommentForm from "@/components/Forum/CreateCommentForm.vue";
import { useCommentStore } from "@/stores/comments";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";

const commentStore = useCommentStore();

const route = useRoute();
const forumId = route.params.forumId as string;
const forumTitle = route.params.forumTitle as string;

onBeforeMount(async () => {
  await commentStore.fetchComments(forumId, forumTitle);
});
</script>

<template>
  <section>
    <h1>{{ "Forum: " + forumTitle }}</h1>
    <h1>Create a comment:</h1>
    <CreateCommentForm @refreshComments="commentStore.fetchComments(forumId, forumTitle)" />
  </section>
  <section>
    <h1>{{ "Comments:" }}</h1>
  </section>
  <section class="comments" v-if="commentStore.comments.length !== 0">
    <article v-for="comment in commentStore.comments" :key="comment._id">
      <CommentComponent :comment="comment" @refreshComments="commentStore.fetchComments(forumId, forumTitle)" />
    </article>
  </section>
  <p v-else>No comments found</p>
</template>

<style scoped>
h1 {
  color: white;
}
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

/* section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
} */

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.comments {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
  margin: 2em auto;
  padding: 1em;
  max-width: 1200px;
}
</style>
