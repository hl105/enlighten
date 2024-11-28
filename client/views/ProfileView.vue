<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
// import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

interface Post {
  _id: string;
}
const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
const posts = ref<Post[]>([]);

async function logout() {
  await logoutUser();
  void router.push({ name: "Login" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Login" });
}

const fetchUserPosts = async () => {
  try {
    const response = await fetchy(`/api/posts/${currentUsername.value}`, "GET");
    posts.value = response;
  } catch (error) {
    console.error("Error fetching user posts", error);
  }
};

onMounted(async () => {
  await fetchUserPosts();
});
</script>

<template>
  <main class="profile">
    <div class="header">
      <img class="profile-image" src="../assets/images/default_profile.png" />
      <h1>{{ currentUsername }}</h1>
      <div class="buttons">
        <button class="button" id="logout" @click="logout">Logout</button>
        <button class="button" id="delete" @click="delete_">Delete User</button>
      </div>
    </div>
    <!--badges will go here-->
    <div class="posts">
      <PostComponent v-for="post in posts" :key="post._id" :post="post" @refreshPosts="fetchUserPosts" class="post" />
    </div>
  </main>
</template>

<style scoped>
.header {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
  gap: 3em;
  align-items: center;
  padding-left: 4em;
  padding-top: 2em;
}

.buttons {
  display: flex;
  padding: 2em;
  gap: 2em;
}

h1 {
  font-size: 4em;
  flex: 1 1 auto;
}

.profile-image {
  width: 8em;
  height: 8em;
  border-radius: 50%;
  border: 0.3em solid black;
  object-fit: cover;
}

.pure-button {
  border: 0.1em solid #000000;
  background-color: white;
}

/* Posts Section */
.posts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Responsive grid */
  gap: 1.5em;
  margin: 2em auto;
  padding: 1em;
  max-width: 1200px;
}

.post {
  background: #063970; /* Light card-like background */
  border-radius: 12px;
  padding: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  color: white;
}

.button {
  cursor: pointer;
  font-size: 1em;
  padding: 0.5em 1em;
  background-color: white;
  color: #063970;
  border-radius: 5px;
  font-weight: bold;
}

.button:hover {
  background-color: #e6f7ff;
}
</style>
