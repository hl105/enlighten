<script setup lang="ts">
import CommentComponent from "@/components/Forum/CommentComponent.vue";
import CreateCommentForm from "@/components/Forum/CreateCommentForm.vue";
import { useCommentStore } from "@/stores/comments";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";

const commentStore = useCommentStore();

const route = useRoute();
const forumId = route.params.forumId as string;

/*const forumTitleFromId = async (forumId: string) => {
  try {
    const response = await fetchy(`/api/forums/${forumId}`, "GET");
    return response;
  } catch (e) {
    return;
  }
};

const forumTitle = await forumTitleFromId(forumId);*/

//forumTitle isn't working?

onBeforeMount(async (forumId: string) => {
  await commentStore.fetchComments(forumId);
});
</script>

<template>
  <section>
    <h2>{{ "Forum: " + forumId }}</h2>
    <h2>Create a comment:</h2>
    <CreateCommentForm @refreshComments="commentStore.fetchComments(forumId)" />
  </section>
  <section class="comments" v-if="commentStore.comments.length !== 0">
    <article v-for="comment in commentStore.comments" :key="comment._id">
      <CommentComponent :comment="comment" @refreshForums="commentStore.fetchComments(forumId)" />
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
