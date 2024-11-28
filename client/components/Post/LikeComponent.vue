<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const props = defineProps(["postId"]);
const likesCount = ref(0);
const liked = ref(false);

const fetchLikesCount = async () => {
  try {
    const response = await fetchy(`api/posts/${props.postId}/likes`, "GET");
    likesCount.value = response.likes; // Assume response contains a `likes` field
  } catch (error) {
    console.error("Error fetching likes count:", error);
  }
};

const toggleLike = async () => {
  const number = liked.value ? -1 : 1; //unlike, like
  liked.value = !liked.value;
  likesCount.value += number;

  try {
    await fetchy(`api/posts/${props.postId}/likes`, "POST", {
      body: { num: number },
    });
  } catch (error) {
    console.error("error with likes", error);
    // console.log("postId:", props.postId);
    liked.value = !liked.value;
    likesCount.value -= number;
  }
};

onMounted(fetchLikesCount);
</script>
<template>
  <span class="likes-count">{{ likesCount }}</span>
  <button @click="toggleLike" class="like-button">
    <svg viewBox="0 0 24 24" class="heart-icon" :class="{ liked }">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  </button>
</template>

<style scoped>
.likes-count {
  margin-right: 8px;
}
.like-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.heart-icon {
  width: 32px;
  height: 32px;
  fill: none; /* Default empty heart */
  stroke: #d1d1d1;
  stroke-width: 2;
  transition:
    fill 0.3s ease,
    stroke 0.3s ease;
}

.heart-icon.liked {
  fill: red; /* Red filled heart */
  stroke: red;
}
</style>
