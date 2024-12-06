<script setup lang="ts">
import CommentComponent from "@/components/Forum/CommentComponent.vue";
import CreateCommentForm from "@/components/Forum/CreateCommentForm.vue";
import { useCommentStore } from "@/stores/comments";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";

const commentStore = useCommentStore();

const route = useRoute();
const forumId = route.params.forumId as string;

/*const forumTitleFromId = async () => {
  try {
    const response = await fetchy(`/api/forums/${forumId}`, "GET");
    return response;
  } catch (e) {
    return;
  }
};*/

//const forumTitle = await forumTitleFromId();
//this isnt working?

onBeforeMount(async () => {
  await commentStore.fetchComments(forumId);
});
</script>

<template>
  <section>
    <h1>{{ "Forum: " + forumId }}</h1>
    <h1>Create a comment:</h1>
    <CreateCommentForm @refreshComments="commentStore.fetchComments(forumId)" />
  </section>
  <section>
    <h1>{{ "Comments:" }}</h1>
  </section>
  <section class="comments" v-if="commentStore.comments.length !== 0">
    <article v-for="comment in commentStore.comments" :key="comment._id">
      <CommentComponent :comment="comment" @refreshComments="commentStore.fetchComments(forumId)" />
    </article>
  </section>
  <p v-else>No comments found</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.comments {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
