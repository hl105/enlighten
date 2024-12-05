<script setup lang="ts">
import router from "@/router";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from "vue";

const currentRouteName = computed(() => router.currentRoute.value.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const isSidebarVisible = ref(false); // State to toggle sidebar visibility

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});

const handleScroll = () => {
  if (isSidebarVisible.value) {
    isSidebarVisible.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

// Remove event listener on component unmount
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value;
};

const navigateTo = async (viewName: string) => {
  isSidebarVisible.value = false;
  await router.push({ name: viewName });
};
</script>

<template>
  <header>
    <!-- Navbar -->
    <nav v-if="currentRouteName !== 'Login'">
      <!-- Hamburger Icon -->
      <div class="hamburger" @click="toggleSidebar">☰</div>

      <!-- Title -->
      <h1 class="title" @click="navigateTo('Home')">Enlighten</h1>

      <!-- Profile Button -->
      <div v-if="isLoggedIn" class="profile-button" @click="navigateTo('Profile')">Profile</div>
      <div v-else class="profile-button" @click="navigateTo('Login')">Login</div>
    </nav>

    <!-- Sidebar -->
    <aside class="sidebar" v-if="isSidebarVisible && currentRouteName !== 'Login'">
      <ul>
        <li @click="navigateTo('Map')">Map</li>
        <li @click="navigateTo('Posts')">Posts</li>
        <li @click="navigateTo('Forums')">Forums</li>
        <li @click="navigateTo('Find')">Find</li>
      </ul>
    </aside>

    <!-- Toast Notification -->
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  padding: 1em 2em;
  background-color: #063970;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  position: relative;
}

.title {
  cursor: pointer;
  font-size: 1.5em;
  text-align: center;
  margin: 0 auto;
  flex-grow: 1;
  color: white;
}

.hamburger {
  font-size: 1.5em;
  cursor: pointer;
  color: white;
}

.profile-button {
  cursor: pointer;
  font-size: 1em;
  padding: 0.5em 1em;
  background-color: white;
  color: #063970;
  border-radius: 5px;
  font-weight: bold;
}

.profile-button:hover {
  background-color: #e6f7ff;
}

.sidebar {
  position: fixed;
  left: 0;
  height: 90%;
  width: 200px;
  background-color: #063970;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  padding-top: 3em;
  z-index: 1000;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar li {
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  color: white;
}

.sidebar li:hover {
  background-color: #151f69;
}

.toast {
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 1rem;
  background-color: #333;
  color: white;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
