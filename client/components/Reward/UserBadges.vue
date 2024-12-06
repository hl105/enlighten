<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

interface Badge {
  _id: string;
  name: string;
  logo: string;
  threshold: number; // Assuming badges have a threshold property
}

interface BadgeResponse {
  msg: string;
  earnedBadges: Badge[];
  notEarnedBadges: [Badge, number][]; // Array of [Badge, pointsLeft]
}

const userStore = useUserStore();
const currentUsername = userStore.currentUsername;
const earnedBadges = ref<Badge[]>([]);
const notEarnedBadges = ref<[Badge, number][]>([]);
const selectedBadgeTab = ref<"earned" | "notEarned">("earned");

const fetchBadges = async () => {
  try {
    const response: BadgeResponse = await fetchy(`/api/user/${currentUsername}/badges`, "GET");
    earnedBadges.value = response.earnedBadges;
    notEarnedBadges.value = response.notEarnedBadges;
  } catch (error) {
    console.error("Error fetching badges:", error);
  }
};

onMounted(async () => {
  await fetchBadges();
});
</script>

<template>
  <div class="badges-container">
    <div class="tabs">
      <!-- Badge Tabs -->
      <button class="tab-button" :class="{ active: selectedBadgeTab === 'earned' }" @click="selectedBadgeTab = 'earned'">Earned Badges</button>
      <button class="tab-button" :class="{ active: selectedBadgeTab === 'notEarned' }" @click="selectedBadgeTab = 'notEarned'">Badges in Progress</button>
    </div>
    <!-- Earned Badges -->
    <div v-if="selectedBadgeTab === 'earned'" class="badge-list">
      <p v-if="earnedBadges.length === 0">No earned badges yet.</p>
      <div v-for="badge in earnedBadges" :key="badge._id" class="badge-card">
        <img :src="badge.logo" class="badge-img" />
        <h3>{{ badge.name }}</h3>
        <p>{{ badge.threshold }} points achieved!</p>
      </div>
    </div>
    <!-- Not Earned Badges -->
    <div v-if="selectedBadgeTab === 'notEarned'" class="badge-list">
      <p v-if="notEarnedBadges.length === 0">No badges in progress</p>
      <div v-for="[badge, pointsLeft] in notEarnedBadges" :key="badge._id" class="badge-card">
        <h3>{{ badge.name }}</h3>
        <img :src="badge.logo" class="badge-img" />
        <p>{{ pointsLeft }} / {{ badge.threshold }} Points Left</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badges-container {
  margin: 2em auto;
  max-width: 800px;
  text-align: center;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 1em;
  margin-bottom: 2em;
}

.tab-button {
  cursor: pointer;
  padding: 0.5em 1em;
  border: 2px solid #063970;
  border-radius: 5px;
  background: transparent;
  color: #063970;
  font-size: 1em;
  font-weight: bold;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.tab-button.active {
  background: #063970;
  color: white;
}

.badge-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5em;
}

.badge-card {
  padding: 1em;
  border-radius: 8px;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.badge-card {
  background: #f5f5f5;
  color: #063970;
  border: 1px solid #063970;
}

.badge-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.badge-img {
  width: 8em;
  height: 8em;
  border-radius: 50%;
  border: 0.3em solid black;
  object-fit: cover;
}
</style>
